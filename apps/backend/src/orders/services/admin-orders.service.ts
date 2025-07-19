import { DataSource, EntityManager, Repository } from 'typeorm';
import { Order } from '@/orders/entities/order.entity';
import { OrdersProvider } from '@/orders/providers/order.provider';
import { Product } from '@/products/entities/product.entity';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDto } from '@/orders/dtos/order.dto';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { AdminOrderQueryDto } from '@/orders/dtos/admin-order-query.dto';
import { UpdateOrderStatusDto } from '@/orders/dtos/update-order-status.dto';
import { OrderMapperProvider } from '@/orders/providers/order-mapper.provider';
import { createPaginationMeta } from '@/orders/helpers/creare-pagination.helper';

interface IAdminOrdersService {
  findAll(query: AdminOrderQueryDto): Promise<PaginatedResponse<OrderDto>>;
  findOne(orderId: string): Promise<OrderDto>;
  updateStatus(orderId: string, updateStatusDto: UpdateOrderStatusDto): Promise<OrderDto>;
  updatePaymentStatus(
    orderId: string,
    transactionId: string,
    paymentStatus: PaymentStatusEnum,
  ): Promise<Order>;
}

@Injectable()
export class AdminOrdersService implements IAdminOrdersService {
  private readonly logger = new Logger(AdminOrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly ordersProvider: OrdersProvider,
    private readonly orderMapperProvider: OrderMapperProvider,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Admin: Lấy tất cả đơn hàng
   */
  async findAll(query: AdminOrderQueryDto): Promise<PaginatedResponse<OrderDto>> {
    const { data, total } = await this.ordersProvider.findAllOrders(query);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return {
      data: data.map((order) => this.orderMapperProvider.mapOrderToDto(order)),
      meta: createPaginationMeta(total, page, limit),
    };
  }

  /**
   * Admin: Lấy chi tiết đơn hàng
   */
  async findOne(orderId: string): Promise<OrderDto> {
    const order = await this.ordersProvider.findOrderById(orderId);
    return order;
  }

  /**
   * Admin: Cập nhật trạng thái đơn hàng
   */
  async updateStatus(orderId: string, updateStatusDto: UpdateOrderStatusDto): Promise<OrderDto> {
    const order = await this.ordersProvider.updateOrderStatus(orderId, updateStatusDto.status);
    return order;
  }

  /**
   * Cập nhật trạng thái thanh toán đơn hàng
   */
  async updatePaymentStatus(
    orderId: string,
    transactionId: string,
    paymentStatus: PaymentStatusEnum,
  ): Promise<Order> {
    return await this.dataSource.transaction(async (manager) => {
      // Tìm đơn hàng
      const order = await this.findOrderById(orderId, manager);

      // Kiểm tra điều kiện cập nhật
      if (!this.canUpdatePaymentStatus(order, orderId, transactionId)) {
        return order;
      }

      // Cập nhật payment status và transaction ID
      this.updatePaymentInfo(order, paymentStatus, transactionId);

      // Xử lý logic theo trạng thái thanh toán
      await this.handlePaymentChange(order, paymentStatus, orderId, manager);

      // Lưu đơn hàng
      const savedOrder = await manager.save(order);
      this.logPaymentUpdate(orderId, paymentStatus, savedOrder.status);

      return savedOrder;
    });
  }

  /**
   * Kiểm tra xem có thể cập nhật payment status hay không
   */
  private canUpdatePaymentStatus(order: Order, orderId: string, transactionId: string): boolean {
    // Chỉ cập nhật nếu đang PENDING payment
    if (order.paymentStatus !== PaymentStatusEnum.PENDING) {
      this.logger.warn(
        `Attempted to update payment status for order ${orderId} ` +
          `but current status is ${order.paymentStatus}`,
      );
      return false;
    }

    // Kiểm tra duplicate transaction
    if (order.transactionId && order.transactionId === transactionId) {
      this.logger.warn(`Duplicate transaction ${transactionId} for order ${orderId}`);
      return false;
    }

    return true;
  }

  /**
   * Cập nhật thông tin thanh toán của đơn hàng
   */
  private updatePaymentInfo(
    order: Order,
    paymentStatus: PaymentStatusEnum,
    transactionId: string,
  ): void {
    order.paymentStatus = paymentStatus;
    order.transactionId = transactionId;
  }

  /**
   * Xử lý logic thay đổi theo trạng thái thanh toán
   */
  private async handlePaymentChange(
    order: Order,
    paymentStatus: PaymentStatusEnum,
    orderId: string,
    manager: EntityManager,
  ): Promise<void> {
    if (paymentStatus === PaymentStatusEnum.PAID) {
      order.status = OrderStatusEnum.PROCESSING;
    } else if (paymentStatus === PaymentStatusEnum.FAILED) {
      await this.handleFailedPayment(order, orderId, manager);
    }
  }

  /**
   * Xử lý khi thanh toán thất bại
   */
  private async handleFailedPayment(
    order: Order,
    orderId: string,
    manager: EntityManager,
  ): Promise<void> {
    // Khi thanh toán thất bại, chuyển order status sang CANCELLED
    order.status = OrderStatusEnum.CANCELLED;

    // Hoàn trả stock
    await this.restoreStock(orderId, manager);
  }

  /**
   * Hoàn trả stock khi thanh toán thất bại
   */
  private async restoreStock(orderId: string, manager: EntityManager): Promise<void> {
    // Tìm đơn hàng với items
    const orderWithItems = await manager.findOne(Order, {
      where: { id: orderId },
      relations: ['items'],
    });

    // Hoàn trả stock nếu thanh toán thất bại
    if (orderWithItems?.items) {
      for (const item of orderWithItems.items) {
        await manager.increment(Product, { id: item.productId }, 'stockQuantity', item.quantity);
      }
    }
  }

  /**
   * Log thông tin cập nhật payment status
   */
  private logPaymentUpdate(
    orderId: string,
    paymentStatus: PaymentStatusEnum,
    orderStatus: OrderStatusEnum,
  ): void {
    this.logger.log(
      `Order ${orderId} payment status updated: ${paymentStatus}, ` +
        `order status: ${orderStatus}`,
    );
  }

  /**
   * Kiểm tra xem user đã mua sản phẩm hay chưa
   */
  async hasPurchased(userId: string, productId: string): Promise<boolean> {
    const count = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .where('order.user.id = :userId', { userId })
      .andWhere('item.product.id = :productId', { productId })
      .andWhere('order.status = :status', { status: OrderStatusEnum.DELIVERED })
      .getCount();
    return count > 0;
  }

  private async findOrderById(orderId: string, manager: EntityManager): Promise<Order> {
    const order = await manager.findOne(Order, {
      where: { id: orderId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${orderId}`);
    }

    return order;
  }
}
