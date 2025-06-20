import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AdminOrderQueryDto } from '@/orders/dtos/admin-order-query.dto';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { Order } from '@/orders/entities/order.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersProvider {
  private readonly logger = new Logger(OrdersProvider.name);

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
    // Validate input
    if (!userId?.trim()) {
      throw new BadRequestException('User ID không hợp lệ');
    }

    const { page = 1, limit = 10 } = query;

    // Validate pagination params
    if (page < 1) {
      throw new BadRequestException('Số trang phải lớn hơn 0');
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Số item mỗi trang phải từ 1-100');
    }

    const skip = (page - 1) * limit;

    try {
      const queryBuilder = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.product', 'product')
        .where('order.userId = :userId', { userId })
        .orderBy('order.orderDate', 'DESC')
        .skip(skip)
        .take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      // Đảm bảo data luôn là array
      const safeData = Array.isArray(data) ? data : [];

      this.logger.debug(
        `🔍 Query executed for user ${userId}: found ${total} orders, returned ${safeData.length} items`,
      );

      return {
        data: safeData,
        total: total || 0,
      };
    } catch (error) {
      this.logger.error(`❌ Database error while fetching orders for user ${userId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Lỗi truy vấn cơ sở dữ liệu: ${errorMessage}`);
    }
  }

  /**
   * Tìm đơn hàng của user theo ID
   */
  async findUserOrderById(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId: userId },
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
    const { page = 1, limit = 10, status, userId, dateFrom, dateTo, search } = query;
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
      queryBuilder = queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    if (dateFrom) {
      queryBuilder = queryBuilder.andWhere('order.orderDate >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder = queryBuilder.andWhere('order.orderDate <= :dateTo', { dateTo });
    }

    if (search) {
      const searchPattern = `%${search}%`;
      queryBuilder = queryBuilder.andWhere(
        `(
          CAST(order.id AS TEXT) ILIKE :searchPattern OR 
          user.email ILIKE :searchPattern OR 
          user.username ILIKE :searchPattern OR 
          COALESCE(user.phoneNumber, '') ILIKE :searchPattern OR
          order.shippingAddress ILIKE :searchPattern
        )`,
        { searchPattern },
      );
    }

    queryBuilder = queryBuilder.orderBy('order.orderDate', 'DESC').skip(skip).take(limit);

    try {
      const [data, total] = await queryBuilder.getManyAndCount();

      return { data, total };
    } catch (error) {
      this.logger.error(' Error in findAllOrders:', error);
      throw new BadRequestException('Không thể lấy danh sách đơn hàng');
    }
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
      [OrderStatusEnum.PENDING]: [
        OrderStatusEnum.PROCESSING,
        OrderStatusEnum.SHIPPED,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.PROCESSING]: [
        OrderStatusEnum.SHIPPED,
        OrderStatusEnum.DELIVERED,
        OrderStatusEnum.CANCELLED,
      ],
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
