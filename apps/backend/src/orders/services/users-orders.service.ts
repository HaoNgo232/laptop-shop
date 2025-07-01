import { DataSource } from 'typeorm';
import { OrdersProvider } from '@/orders/providers/order.provider';
import { Product } from '@/products/entities/product.entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { OrderMapperProvider } from '@/orders/providers/order-mapper.provider';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { CreatePaginationMetaUseCase } from '@/orders/usecases/create-pagination-meta.usecase';
import { ValidateCartUseCase } from '@/orders/usecases/validate-cart.usecase';
import { ValidateStockAndCalculateTotalUseCase } from '@/orders/usecases/validate-stock-and-calculate-total.usecase';
import { CreateOrderTransactionUseCase } from '@/orders/usecases/create-order-transaction.usecase';
import { GeneratePaymentQrUseCase } from '@/orders/usecases/generate-payment-qr.usecase';

interface IUsersOrdersService {
  create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse }>;
  findAll(userId: string, query: PaginationQueryDto): Promise<PaginatedResponse<OrderDto>>;
  findOne(userId: string, orderId: string): Promise<OrderDetailDto>;
  cancel(userId: string, orderId: string): Promise<OrderDto>;
}

@Injectable()
export class UsersOrdersService implements IUsersOrdersService {
  private readonly logger = new Logger(UsersOrdersService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly orderMapperProvider: OrderMapperProvider,
    private readonly ordersProvider: OrdersProvider,
    private readonly createPaginationMetaUseCase: CreatePaginationMetaUseCase,
    private readonly validateCartUseCase: ValidateCartUseCase,
    private readonly validateStockAndCalculateTotalUseCase: ValidateStockAndCalculateTotalUseCase,
    private readonly createOrderTransactionUseCase: CreateOrderTransactionUseCase,
    private readonly generatePaymentQrUseCase: GeneratePaymentQrUseCase,
  ) {}

  /**
   * Tạo đơn hàng mới từ giỏ hàng
   */
  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse }> {
    // 1. Validate cart using use case
    const cart = await this.validateCartUseCase.execute(userId);

    // 2. Validate stock và calculate total using use case
    const { orderItems, totalAmount } = await this.validateStockAndCalculateTotalUseCase.execute(
      cart.cartItems,
    );

    // 3. Create order in transaction using use case
    const order = await this.createOrderTransactionUseCase.execute({
      userId,
      createOrderDto,
      orderItems,
      totalAmount,
    });

    // 4. Generate QR code using use case
    const qrCode = await this.generatePaymentQrUseCase.execute(order, createOrderDto.paymentMethod);

    return {
      order: this.orderMapperProvider.mapOrderToDto(order),
      qrCode,
    };
  }

  // Private methods đã được thay thế bằng use cases

  /**
   * Lấy danh sách đơn hàng của user
   */
  async findAll(userId: string, query: PaginationQueryDto): Promise<PaginatedResponse<OrderDto>> {
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
        meta: this.createPaginationMetaUseCase.execute(total, page, limit),
      };

      return result;
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
}
