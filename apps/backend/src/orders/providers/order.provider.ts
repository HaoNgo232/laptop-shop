import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AdminOrderQueryDto } from '@/orders/dtos/admin-order-query.dto';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { Order } from '@/orders/entities/order.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  /**
   * Tìm đơn hàng của user với pagination
   */
  async findUserOrders(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<{ data: Order[]; total: number }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.user_id = :userId', { userId })
      .orderBy('order.order_date', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  /**
   * Tìm đơn hàng của user theo ID
   */
  async findUserOrderById(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId },
      relations: ['items', 'items.product', 'items.product.category', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID: ${orderId}`);
    }

    return order;
  }

  /**
   * Admin: Tìm tất cả đơn hàng với filters
   */
  async findAllOrders(query: AdminOrderQueryDto): Promise<{ data: Order[]; total: number }> {
    const { page = 1, limit = 10, status, userId, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    let queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (status) {
      queryBuilder = queryBuilder.andWhere('order.status = :status', { status });
    }

    if (userId) {
      queryBuilder = queryBuilder.andWhere('order.user_id = :userId', { userId });
    }

    if (dateFrom) {
      queryBuilder = queryBuilder.andWhere('order.order_date >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder = queryBuilder.andWhere('order.order_date <= :dateTo', { dateTo });
    }

    queryBuilder = queryBuilder.orderBy('order.order_date', 'DESC').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  /**
   * Tìm đơn hàng theo ID (Admin)
   */
  async findOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'items.product.category', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID: ${orderId}`);
    }

    return order;
  }

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(orderId: string, status: OrderStatusEnum): Promise<Order> {
    const order = await this.findOrderById(orderId);

    // Kiểm tra logic business cho việc chuyển trạng thái
    this.validateStatusTransition(order.status, status);

    order.status = status;
    return await this.orderRepository.save(order);
  }

  /**
   * Hủy đơn hàng của user
   */
  async cancelUserOrder(userId: string, orderId: string): Promise<Order> {
    const order = await this.findUserOrderById(userId, orderId);

    // Chỉ cho phép hủy khi đang PENDING hoặc PROCESSING
    if (![OrderStatusEnum.PENDING, OrderStatusEnum.PROCESSING].includes(order.status)) {
      throw new BadRequestException(`Không thể hủy đơn hàng ở trạng thái: ${order.status}`);
    }

    order.status = OrderStatusEnum.CANCELLED;
    return await this.orderRepository.save(order);
  }

  /**
   * Validate logic chuyển trạng thái
   */
  private validateStatusTransition(
    currentStatus: OrderStatusEnum,
    newStatus: OrderStatusEnum,
  ): void {
    const validTransitions: Record<OrderStatusEnum, OrderStatusEnum[]> = {
      [OrderStatusEnum.PENDING]: [OrderStatusEnum.PROCESSING, OrderStatusEnum.CANCELLED],
      [OrderStatusEnum.PROCESSING]: [OrderStatusEnum.SHIPPED, OrderStatusEnum.CANCELLED],
      [OrderStatusEnum.SHIPPED]: [OrderStatusEnum.DELIVERED],
      [OrderStatusEnum.DELIVERED]: [], // Không thể chuyển từ DELIVERED
      [OrderStatusEnum.CANCELLED]: [], // Không thể chuyển từ CANCELLED
    };

    const allowedStatuses = validTransitions[currentStatus] || [];

    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Không thể chuyển từ trạng thái ${currentStatus} sang ${newStatus}`,
      );
    }
  }
}
