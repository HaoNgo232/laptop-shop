import { DataSource } from 'typeorm';
import { OrdersProvider } from '@/orders/providers/order.provider';
import { Product } from '@/products/entities/product.entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';
import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { OrderMapperProvider } from '@/orders/providers/order-mapper.provider';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { ValidateStockUseCase } from '@/orders/usecases/validate-stock.usecase';
import { CreateOrderUseCase } from '@/orders/usecases/create-order.usecase';
import { CartService } from '@/cart/cart.service';
import { DiscountService } from '@/orders/services/discount.service';
import { DiscountCalculation } from '@/orders/interfaces/discount-caculation.interface';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';
import { Order } from '@/orders/entities/order.entity';
import { PaymentsService } from '@/payments/payments.service';
import { createPaginationMeta } from '@/orders/helpers/creare-pagination.helper';

interface IOrdersService {
  create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse; discountInfo: DiscountCalculation }>;
  findAll(userId: string, query: PaginationQueryDto): Promise<PaginatedResponse<OrderDto>>;
  findOne(userId: string, orderId: string): Promise<OrderDetailDto>;
  cancel(userId: string, orderId: string): Promise<OrderDto>;
}

@Injectable()
export class OrdersService implements IOrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly orderMapperProvider: OrderMapperProvider,
    private readonly ordersProvider: OrdersProvider,
    private readonly validateStock: ValidateStockUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly cartService: CartService,
    private readonly discountService: DiscountService,
    private readonly paymentsService: PaymentsService,
  ) {}

  /**
   * Tạo đơn hàng mới từ giỏ hàng
   */
  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse; discountInfo: DiscountCalculation }> {
    // 1. Tìm cart của user
    const cart = await this.cartService.findCart(userId);

    // 2. Kiểm tra số lượng sản phẩm có đủ không và tính tổng tiền (chưa áp dụng discount)
    const { orderItems, totalAmount: originalAmount } = await this.validateStock.execute(
      cart.cartItems,
    );

    // 3. Tính toán giảm giá dựa trên rank của user
    const discountInfo = await this.discountService.calculate(userId, originalAmount);

    // 4. Tạo order với số tiền đã giảm giá
    const order = await this.createOrderUseCase.execute({
      userId,
      createOrderDto,
      orderItems,
      totalAmount: discountInfo.finalAmount, // Sử dụng finalAmount thay vì originalAmount
    });

    // 5. Tạo QR code với số tiền đã giảm giá
    const qrCode = await this.generateQRCode(order, createOrderDto.paymentMethod);

    // 6. Map và return result với thông tin giảm giá
    return {
      order: this.orderMapperProvider.mapOrderToDto(order),
      qrCode,
      discountInfo, // Trả về thông tin giảm giá để frontend hiển thị
    };
  }

  /**
   * Lấy danh sách đơn hàng của user
   */
  async findAll(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<OrderDto> & { message: string }> {
    try {
      this.logger.log(`📦 Lấy danh sách đơn hàng cho user: ${userId}, query:`, query);

      const { data, total } = await this.ordersProvider.findUserOrders(userId, query);

      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      // Log thông tin debug
      this.logger.log(`📊 Tìm được ${total} đơn hàng cho user ${userId}, trang ${page}`);

      if (total === 0) {
        this.logger.log(`📭 User ${userId} chưa có đơn hàng nào`);
      }

      const result = {
        data: data.map((order) => this.orderMapperProvider.mapOrderToDto(order)),
        meta: createPaginationMeta(total, page, limit),
      };

      // Tạo message phù hợp
      let message: string;
      if (result.meta.totalItems === 0) {
        message = 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!';
      } else if (result.meta.totalItems === 1) {
        message = 'Bạn có 1 đơn hàng.';
      } else {
        message = `Bạn có ${result.meta.totalItems} đơn hàng.`;
      }

      return {
        ...result,
        message,
      };
    } catch (error) {
      this.logger.error(
        `PaymentsService Lỗi khi lấy danh sách đơn hàng cho user ${userId}:`,
        error,
      );
      throw new BadRequestException(`Không thể lấy danh sách đơn hàng: ${error}`);
    }
  }

  /**
   * Lấy chi tiết đơn hàng của user
   */
  async findOne(userId: string, orderId: string): Promise<OrderDetailDto> {
    const order = await this.ordersProvider.findUserOrderById(userId, orderId);
    return this.orderMapperProvider.mapOrderToDetailDto(order);
  }

  /**
   * Hủy đơn hàng của user
   */
  async cancel(userId: string, orderId: string): Promise<OrderDto> {
    return await this.dataSource.transaction(async (manager) => {
      const order = await this.ordersProvider.cancelUserOrder(userId, orderId);

      // Hoàn trả stock
      for (const item of order.items) {
        await manager.increment(Product, { id: item.productId }, 'stockQuantity', item.quantity);
      }

      return this.orderMapperProvider.mapOrderToDto(order);
    });
  }

  /**
   * Tạo QR code cho payment nếu cần thiết
   */
  private async generateQRCode(
    order: Order,
    paymentMethod: PaymentMethodEnum,
  ): Promise<QRCodeResponse | undefined> {
    if (paymentMethod !== PaymentMethodEnum.SEPAY_QR) {
      return undefined;
    }

    try {
      const qrCode = await this.paymentsService.generateQRCode({
        orderId: order.id,
        amount: Number(order.totalAmount),
        paymentMethod,
        expireMinutes: 15,
      });

      this.logger.log(`QR code generated successfully for order ${order.id}`);
      return qrCode;
    } catch (qrError) {
      // QR generation failure không nên fail order creation
      this.logger.error(`Failed to generate QR code for order ${order.id}:`, qrError);
      return undefined;
    }
  }
}
