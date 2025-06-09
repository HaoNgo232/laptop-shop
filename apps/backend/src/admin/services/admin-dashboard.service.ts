/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DashboardSummaryDto } from '@/admin/dtos/dashboard-summary.dto';
import { DetailedStatsDto } from '@/admin/dtos/detailed-stats.dto';
import { User } from '@/auth/entities/user.entity';
import { Order } from '@/orders/entities/order.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { Product } from '@/products/entities/product.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Lấy tóm tắt dashboard bao gồm thống kê người dùng, sản phẩm, đơn hàng và doanh thu
   * @returns Promise<DashboardSummaryDto> - Dữ liệu tóm tắt dashboard
   */
  async getDashboardSummary(): Promise<DashboardSummaryDto> {
    try {
      const thirtyDaysAgo = this.getDateDaysAgo(30);

      const [totalUsers, newUsers, totalProducts, totalOrders, newOrders, totalRevenue] =
        await Promise.all([
          this.userRepository.count(),
          this.userRepository.count({ where: { createdAt: MoreThan(thirtyDaysAgo) } }),
          this.productRepository.count(),
          this.orderRepository.count(),
          this.orderRepository.count({ where: { orderDate: MoreThan(thirtyDaysAgo) } }),
          this.getTotalRevenue(),
        ]);

      return {
        totalUsers,
        newUsersCount: newUsers,
        totalProducts,
        totalOrders,
        newOrdersCount: newOrders,
        totalRevenue,
      };
    } catch (error) {
      console.error('Error in getDashboardSummary:', error);
      throw new InternalServerErrorException('Failed to get dashboard summary');
    }
  }

  /**
   * Lấy thống kê chi tiết bao gồm đơn hàng theo trạng thái và doanh thu theo tháng
   * @returns Promise với ordersByStatus và revenueByMonth
   */
  async getDetailedStats(): Promise<DetailedStatsDto> {
    const sixMonthsAgo = this.getDateDaysAgo(6 * 30); // 180 ngày = 6 tháng

    const [ordersByStatus, revenueByMonth] = await Promise.all([
      this.orderRepository
        .createQueryBuilder('order')
        .select('order.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('order.status')
        .getRawMany(),

      this.orderRepository
        .createQueryBuilder('order')
        .select("DATE_TRUNC('month', order.order_date)", 'month')
        .addSelect('SUM(order.total_amount)', 'revenue')
        .where('order.status = :status', {
          status: OrderStatusEnum.DELIVERED,
        })
        .andWhere('order.order_date >= :sixMonthsAgo', { sixMonthsAgo })
        .groupBy('month')
        .orderBy('month', 'ASC')
        .getRawMany(),
    ]);

    return {
      ordersByStatus,
      revenueByMonth,
    };
  }

  /**
   * Tính toán ngày cách đây n ngày
   * @param days - Số ngày cần tính ngược
   * @returns Date - Ngày cách đây n ngày
   */
  private getDateDaysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  /**
   * Tính tổng doanh thu từ các đơn hàng đã hoàn thành
   * @returns Promise<number> - Tổng doanh thu
   */
  private async getTotalRevenue(): Promise<number> {
    const { total } = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status = :status', { status: OrderStatusEnum.DELIVERED })
      .getRawOne();

    return Number(total);
  }
}
