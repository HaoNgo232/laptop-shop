/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DashboardSummaryDto } from '@/admin/dtos/dashboard-summary.dto';
import { DetailedStatsDto } from '@/admin/dtos/detailed-stats.dto';
import { User } from '@/auth/entities/user.entity';
import { Order } from '@/orders/entities/order.entity';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { Product } from '@/products/entities/product.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

interface IAdminDashboardService {
  getSummary(): Promise<DashboardSummaryDto>;
  getStats(): Promise<DetailedStatsDto>;
}

@Injectable()
export class AdminDashboardService implements IAdminDashboardService {
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
  async getSummary(): Promise<DashboardSummaryDto> {
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
      console.error('Error in getSummary:', error);
      throw new InternalServerErrorException('Failed to get dashboard summary');
    }
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
   * (không phụ thuộc vào order status)
   */
  private async getTotalRevenue(): Promise<number> {
    const { total } = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.paymentStatus = :paymentStatus', { paymentStatus: PaymentStatusEnum.PAID })
      .getRawOne();

    return Number(total) || 0;
  }

  /**
   * Doanh thu theo tháng - cũng dựa trên payment status
   */
  async getStats(): Promise<DetailedStatsDto> {
    const sixMonthsAgo = this.getDateDaysAgo(6 * 30); // 6 tháng trước

    const [ordersByStatus, revenueByMonth] = await Promise.all([
      // Order stats - theo order status
      this.orderRepository
        .createQueryBuilder('order')
        .select('order.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('order.status')
        .getRawMany(),

      // Revenue stats - theo payment status
      this.orderRepository
        .createQueryBuilder('order')
        .select("DATE_TRUNC('month', order.order_date)", 'month')
        .addSelect('SUM(order.total_amount)', 'revenue')
        .where('order.paymentStatus = :paymentStatus', {
          paymentStatus: PaymentStatusEnum.PAID, //  Dựa trên payment
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
}
