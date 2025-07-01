import { DataSource, Repository } from 'typeorm';
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
import { CreatePaginationMetaUseCase } from '@/orders/usecases/create-pagination-meta.usecase';

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
    private readonly createPaginationMetaUseCase: CreatePaginationMetaUseCase,
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
      meta: this.createPaginationMetaUseCase.execute(total, page, limit),
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

  // Method để cập nhật order khi nhận webhook với transaction handling
  async updatePaymentStatus(
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
