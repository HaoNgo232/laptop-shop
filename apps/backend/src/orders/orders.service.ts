/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { CartItem } from '@/cart/entities/cart-item.entity';

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
    // 1. Lấy và validate cart
    const cart = await this.validateAndGetCart(userId);

    // 2. Validate stock và tính tổng tiền
    const { orderItems, totalAmount } = await this.validateStockAndCalculateTotal(cart.cartItems);

    // 3. Tạo đơn hàng trong transaction
    const order = await this.createOrderTransaction(
      userId,
      createOrderDto,
      orderItems,
      totalAmount,
    );

    // 4. Tạo QR code nếu cần
    const qrCode = await this.generateQRCodeIfNeeded(order, createOrderDto.paymentMethod);

    return {
      order: this.orderMapperProvider.mapOrderToDto(order),
      qrCode,
    };
  }

  /**
   * Validate và lấy cart của user
   */
  private async validateAndGetCart(userId: string) {
    const cart = await this.cartService.getCartEntityByUserId(userId);

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Giỏ hàng trống, không thể tạo đơn hàng');
    }

    return cart;
  }

  /**
   * Validate stock và tính tổng tiền
   */
  private async validateStockAndCalculateTotal(cartItems: CartItem[]) {
    let totalAmount = 0;
    const orderItems: Pick<OrderItem, 'productId' | 'quantity' | 'priceAtPurchase'>[] = [];

    for (const cartItem of cartItems) {
      // Validate quantity
      if (cartItem.quantity <= 0) {
        throw new BadRequestException(
          `Số lượng sản phẩm phải lớn hơn 0, nhận được: ${cartItem.quantity}`,
        );
      }

      // Lấy thông tin sản phẩm
      const product = await this.productRepository.findOne({
        where: { id: cartItem.productId },
      });

      if (!product) {
        throw new BadRequestException(`Sản phẩm với ID ${cartItem.productId} không tồn tại`);
      }

      // Validate stock
      if (product.stockQuantity < cartItem.quantity) {
        throw new BadRequestException(
          `Sản phẩm "${product.name}" không đủ hàng. Còn lại: ${product.stockQuantity}, yêu cầu: ${cartItem.quantity}`,
        );
      }

      // Validate price
      if (product.price < 0) {
        throw new BadRequestException(`Giá sản phẩm không hợp lệ: ${product.price}`);
      }

      // Tính tổng tiền
      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        priceAtPurchase: product.price,
      });
    }

    return { orderItems, totalAmount };
  }

  /**
   * Tạo đơn hàng trong transaction
   */
  private async createOrderTransaction(
    userId: string,
    createOrderDto: CreateOrderDto,
    orderItems: Pick<OrderItem, 'productId' | 'quantity' | 'priceAtPurchase'>[],
    totalAmount: number,
  ): Promise<Order> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // Tạo order
        const order = manager.create(Order, {
          userId: userId,
          totalAmount: totalAmount,
          shippingAddress: createOrderDto.shippingAddress,
          paymentMethod: createOrderDto.paymentMethod,
          note: createOrderDto.note,
          status: OrderStatusEnum.PENDING,
          paymentStatus: PaymentStatusEnum.PENDING,
        });

        const savedOrder = await manager.save(order);

        // Tạo order items
        for (const item of orderItems) {
          const orderItem = manager.create(OrderItem, {
            ...item,
            orderId: savedOrder.id,
          });
          await manager.save(orderItem);

          // Cập nhật stock
          await manager.decrement(Product, { id: item.productId }, 'stockQuantity', item.quantity);
        }

        // Xóa giỏ hàng
        await this.cartService.clearUserCart(userId);

        return savedOrder;
      });
    } catch (error) {
      this.logger.error('Error creating order transaction:', error);
      throw new BadRequestException(`Không thể tạo đơn hàng: ${error.message}`);
    }
  }

  /**
   * Tạo QR code nếu payment method là SEPAY_QR
   */
  private async generateQRCodeIfNeeded(
    order: Order,
    paymentMethod: PaymentMethodEnum,
  ): Promise<QRCodeResponse | undefined> {
    if (paymentMethod !== PaymentMethodEnum.SEPAY_QR) {
      return undefined;
    }

    try {
      const qrCode = await this.paymentService.generateQRCode(
        order.id,
        Number(order.totalAmount),
        PaymentMethodEnum.SEPAY_QR,
      );
      this.logger.log(`QR code generated successfully for order ${order.id}`);
      return qrCode;
    } catch (qrError) {
      this.logger.error(`Failed to generate QR code for order ${order.id}:`, qrError);
      // QR generation fails không làm fail tạo order
      return undefined;
    }
  }

  /**
   * Helper method để tạo pagination meta
   */
  private createPaginationMeta(
    total: number,
    page: number,
    limit: number,
    search?: string,
  ): PaginationMeta {
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
        meta: this.createPaginationMeta(total, page, limit),
      };

      return result;
    } catch (error) {
      this.logger.error(`❌ Lỗi khi lấy danh sách đơn hàng cho user ${userId}:`, error);
      throw new BadRequestException(`Không thể lấy danh sách đơn hàng: ${error.message}`);
    }
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
        await manager.increment(Product, { id: item.productId }, 'stockQuantity', item.quantity);
      }

      return this.orderMapperProvider.mapOrderToDto(order);
    });
  }

  /**
   * Admin: Lấy tất cả đơn hàng
   */
  async getOrders(query: AdminOrderQueryDto): Promise<PaginatedResponse<OrderDto>> {
    const { data, total } = await this.ordersProvider.findAllOrders(query);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return {
      data: data.map((order) => this.orderMapperProvider.mapOrderToDto(order)),
      meta: this.createPaginationMeta(total, page, limit),
    };
  }

  /**
   * Admin: Lấy chi tiết đơn hàng
   */
  async getOrderById(orderId: string): Promise<OrderDto> {
    const order = await this.ordersProvider.findOrderById(orderId);
    return order;
  }

  /**
   * Admin: Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(
    orderId: string,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    const order = await this.ordersProvider.updateOrderStatus(orderId, updateStatusDto.status);
    return order;
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
        lock: { mode: 'pessimistic_write' },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // Chỉ cập nhật nếu đang PENDING payment
      if (order.paymentStatus !== PaymentStatusEnum.PENDING) {
        this.logger.warn(
          `Attempted to update payment status for order ${orderId} ` +
            `but current status is ${order.paymentStatus}`,
        );
        return order;
      }

      // Kiểm tra duplicate transaction
      if (order.transactionId && order.transactionId === transactionId) {
        this.logger.warn(`Duplicate transaction ${transactionId} for order ${orderId}`);
        return order;
      }

      // Cập nhật payment status
      order.paymentStatus = paymentStatus;
      order.transactionId = transactionId;

      // Nếu thanh toán thành công, chuyển order status
      if (paymentStatus === PaymentStatusEnum.PAID) {
        // Khi thanh toán thành công, chuyển order status sang PROCESSING
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
              { id: item.productId },
              'stockQuantity',
              item.quantity,
            );
          }
        }
      }

      // PaymentStatusEnum.WAITING -> order status vẫn PENDING
      // PaymentStatusEnum.CANCELLED -> order status chuyển sang CANCELLED

      const savedOrder = await manager.save(order);
      this.logger.log(
        `Order ${orderId} payment status updated: ${paymentStatus}, ` +
          `order status: ${savedOrder.status}`,
      );

      return savedOrder;
    });
  }

  async hasPurchasedProduct(userId: string, productId: string): Promise<boolean> {
    const count = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .where('order.user.id = :userId', { userId })
      .andWhere('item.product.id = :productId', { productId })
      .andWhere('order.status = :status', { status: OrderStatusEnum.DELIVERED })
      .getCount();
    return count > 0;
  }
}
