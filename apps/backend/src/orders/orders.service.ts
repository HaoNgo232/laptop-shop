import { DataSource, Repository } from 'typeorm';
import { CartService } from '@/cart/cart.service';
import { Order } from '@/orders/entities/order.entity';
import { OrdersProvider } from '@/orders/providers/order.provider';
import { Product } from '@/products/entities/product.entity';
import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { AdminOrderQueryDto } from '@/orders/dtos/admin-order-query.dto';
import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { UpdateOrderStatusDto } from '@/orders/dtos/update-order-status.dto';
import { PaginationMeta } from '@/products/interfaces/pagination-meta.interface';
import { OrderMapperProvider } from '@/orders/providers/order-mapper.provider';
import { PaymentService } from '@/payment/payment.service';
import { PaymentMethodEnum } from '@/payment/enums/payment-method.enum';
import { QRCodeResponse } from '@/payment/interfaces/payment-provider.interfaces';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cartService: CartService,
    private readonly ordersProvider: OrdersProvider,
    private readonly orderMapperProvider: OrderMapperProvider,
    private readonly dataSource: DataSource,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Tạo đơn hàng mới từ giỏ hàng
   */
  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse }> {
    // 1. Lấy cart items của user
    const cart = await this.cartService.getCartEntityByUserId(userId);

    if (!cart.cart_items || cart.cart_items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống, không thể tạo đơn hàng');
    }

    // 2. Kiểm tra stock và tính tổng tiền
    let totalAmount = 0;
    const orderItems: Pick<OrderItem, 'product_id' | 'quantity' | 'price_at_purchase'>[] = [];

    for (const cartItem of cart.cart_items) {
      // Validate quantity TRƯỚC
      if (cartItem.quantity <= 0) {
        throw new BadRequestException(
          `Số lượng sản phẩm phải lớn hơn 0, nhận được: ${cartItem.quantity}`,
        );
      }

      const product = await this.productRepository.findOne({
        where: { id: cartItem.product_id },
      });

      if (!product) {
        throw new BadRequestException(`Sản phẩm với ID ${cartItem.product_id} không tồn tại`);
      }

      if (product.stock_quantity < cartItem.quantity) {
        throw new BadRequestException(
          `Sản phẩm "${product.name}" không đủ hàng. Còn lại: ${product.stock_quantity}, yêu cầu: ${cartItem.quantity}`,
        );
      }

      // Validate price TRƯỚC
      if (product.price < 0) {
        throw new BadRequestException(`Giá sản phẩm không hợp lệ: ${product.price}`);
      }

      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: product.id,
        quantity: cartItem.quantity,
        price_at_purchase: product.price,
      });
    }

    // 3. Tạo đơn hàng trong transaction
    try {
      const order = await this.dataSource.transaction(async (manager) => {
        // Tạo order
        const order = manager.create(Order, {
          user_id: userId,
          total_amount: totalAmount,
          shipping_address: createOrderDto.shippingAddress,
          payment_method: createOrderDto.paymentMethod,
          note: createOrderDto.note,
          status: OrderStatusEnum.PENDING,
          payment_status: PaymentStatusEnum.PENDING,
        });

        const savedOrder = await manager.save(order);

        // Tạo order items
        for (const item of orderItems) {
          const orderItem = manager.create(OrderItem, {
            ...item,
            order_id: savedOrder.id,
          });
          await manager.save(orderItem);

          // Cập nhật stock
          await manager.decrement(
            Product,
            { id: item.product_id },
            'stock_quantity',
            item.quantity,
          );
        }

        // Xóa giỏ hàng
        await this.cartService.clearUserCart(userId);

        return savedOrder;
      });

      let qrCode: QRCodeResponse | undefined;

      // Nếu payment method là SEPAY_QR, tạo QR code
      if (createOrderDto.paymentMethod === PaymentMethodEnum.SEPAY_QR) {
        try {
          qrCode = await this.paymentService.generateQRCode(
            order.id,
            Number(order.total_amount),
            PaymentMethodEnum.SEPAY_QR,
          );
          this.logger.log(`QR code generated successfully for order ${order.id}`);
        } catch (qrError) {
          this.logger.error(`Failed to generate QR code for order ${order.id}:`, qrError);
          // QR generation fails không làm fail tạo order
          // Có thể retry sau hoặc chuyển sang COD
        }
      }

      return {
        order: this.orderMapperProvider.mapOrderToDto(order),
        qrCode,
      };
    } catch (error) {
      this.logger.error('Error creating order:', error);
      throw new BadRequestException(`Không thể tạo đơn hàng: ${error.message}`);
    }
  }

  /**
   * Helper method để tạo pagination meta
   */
  private createPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  /**
   * Lấy danh sách đơn hàng của user
   */
  async getUserOrders(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<OrderDto>> {
    const { data, total } = await this.ordersProvider.findUserOrders(userId, query);

    const page = query.page || 1;
    const limit = query.limit || 10;

    return {
      data: data.map((order) => this.orderMapperProvider.mapOrderToDto(order)),
      meta: this.createPaginationMeta(total, page, limit),
    };
  }

  /**
   * Lấy chi tiết đơn hàng của user
   */
  async getUserOrderById(userId: string, orderId: string): Promise<OrderDetailDto> {
    const order = await this.ordersProvider.findUserOrderById(userId, orderId);
    return this.orderMapperProvider.mapOrderToDetailDto(order);
  }

  /**
   * Hủy đơn hàng của user
   */
  async cancelUserOrder(userId: string, orderId: string): Promise<OrderDto> {
    return await this.dataSource.transaction(async (manager) => {
      const order = await this.ordersProvider.cancelUserOrder(userId, orderId);

      // Hoàn trả stock
      for (const item of order.items) {
        await manager.increment(Product, { id: item.product_id }, 'stock_quantity', item.quantity);
      }

      return this.orderMapperProvider.mapOrderToDto(order);
    });
  }

  /**
   * Admin: Lấy tất cả đơn hàng
   */
  async getAllOrders(query: AdminOrderQueryDto): Promise<PaginatedResponse<OrderDto>> {
    const { data, total } = await this.ordersProvider.findAllOrders(query);

    const page = query.page || 1;
    const limit = query.limit || 10;

    return {
      data: data.map((order) => this.orderMapperProvider.mapOrderToDto(order)),
      meta: this.createPaginationMeta(total, page, limit),
    };
  }

  /**
   * Admin: Lấy chi tiết đơn hàng
   */
  async getOrderById(orderId: string): Promise<OrderDetailDto> {
    const order = await this.ordersProvider.findOrderById(orderId);
    return this.orderMapperProvider.mapOrderToDetailDto(order);
  }

  /**
   * Admin: Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(
    orderId: string,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    const order = await this.ordersProvider.updateOrderStatus(orderId, updateStatusDto.status);
    return this.orderMapperProvider.mapOrderToDto(order);
  }

  // Method để cập nhật order khi nhận webhook với transaction handling
  async updateOrderPaymentStatus(
    orderId: string,
    transactionId: string,
    paymentStatus: PaymentStatusEnum,
  ): Promise<Order> {
    return await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' }, // Lock để tránh race condition
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // Chỉ cập nhật nếu đang PENDING
      if (order.payment_status !== PaymentStatusEnum.PENDING) {
        this.logger.warn(
          `Attempted to update payment status for order ${orderId} ` +
            `but current status is ${order.payment_status}`,
        );
        return order;
      }

      // Kiểm tra duplicate transaction
      if (order.transaction_id && order.transaction_id === transactionId) {
        this.logger.warn(`Duplicate transaction ${transactionId} for order ${orderId}`);
        return order;
      }

      order.payment_status = paymentStatus;
      order.transaction_id = transactionId;

      // Nếu thanh toán thành công, chuyển order status
      if (paymentStatus === PaymentStatusEnum.PAID) {
        order.status = OrderStatusEnum.PROCESSING;
      } else if (paymentStatus === PaymentStatusEnum.FAILED) {
        order.status = OrderStatusEnum.CANCELLED;

        // Hoàn trả stock nếu thanh toán thất bại
        const orderWithItems = await manager.findOne(Order, {
          where: { id: orderId },
          relations: ['items'],
        });

        if (orderWithItems?.items) {
          for (const item of orderWithItems.items) {
            await manager.increment(
              Product,
              { id: item.product_id },
              'stock_quantity',
              item.quantity,
            );
          }
        }
      }

      const savedOrder = await manager.save(order);
      this.logger.log(
        `Order ${orderId} payment status updated: ${paymentStatus}, ` +
          `order status: ${savedOrder.status}`,
      );

      return savedOrder;
    });
  }
}
