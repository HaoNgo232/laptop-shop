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
      const [totalUsers, newUsers, totalProducts, totalOrders, newOrders, totalRevenue] =
        await Promise.all([
          this.getTotalUsers(),
          this.getNewUsers(),
          this.getTotalProducts(),
          this.getTotalOrders(),
          this.getNewOrders(),
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
   * Lấy thống kê chi tiết bao gồm orders theo status và doanh thu theo tháng
   * @returns Promise<DetailedStatsDto> - Dữ liệu thống kê chi tiết
   */
  async getStats(): Promise<DetailedStatsDto> {
    try {
      const [ordersByStatus, revenueByMonth] = await Promise.all([
        this.getOrdersByStatus(),
        this.getRevenueByMonth(),
      ]);

      return {
        ordersByStatus,
        revenueByMonth,
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      throw new InternalServerErrorException('Failed to get dashboard stats');
    }
  }

  /**
   * Lấy tổng số người dùng
   */
  private async getTotalUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  /**
   * Lấy số người dùng mới trong 30 ngày qua
   */
  private async getNewUsers(): Promise<number> {
    const thirtyDaysAgo = this.getDateDaysAgo(30);
    return await this.userRepository.count({
      where: { createdAt: MoreThan(thirtyDaysAgo) },
    });
  }

  /**
   * Lấy tổng số sản phẩm
   */
  private async getTotalProducts(): Promise<number> {
    return await this.productRepository.count();
  }

  /**
   * Lấy tổng số đơn hàng
   */
  private async getTotalOrders(): Promise<number> {
    return await this.orderRepository.count();
  }

  /**
   * Lấy số đơn hàng mới trong 30 ngày qua
   */
  private async getNewOrders(): Promise<number> {
    const thirtyDaysAgo = this.getDateDaysAgo(30);
    return await this.orderRepository.count({
      where: { orderDate: MoreThan(thirtyDaysAgo) },
    });
  }

  /**
   * Tính tổng doanh thu từ các đơn hàng đã thanh toán
   */
  private async getTotalRevenue(): Promise<number> {
    const { total } = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.paymentStatus = :paymentStatus', {
        paymentStatus: PaymentStatusEnum.PAID,
      })
      .getRawOne();

    return Number(total) || 0;
  }

  /**
   * Lấy thống kê đơn hàng theo status
   */
  private async getOrdersByStatus(): Promise<any[]> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();
  }

  /**
   * Lấy doanh thu theo tháng trong 6 tháng qua
   */
  private async getRevenueByMonth(): Promise<any[]> {
    const sixMonthsAgo = this.getDateDaysAgo(6 * 30);

    return await this.orderRepository
      .createQueryBuilder('order')
      .select("DATE_TRUNC('month', order.order_date)", 'month')
      .addSelect('SUM(order.total_amount)', 'revenue')
      .where('order.paymentStatus = :paymentStatus', {
        paymentStatus: PaymentStatusEnum.PAID,
      })
      .andWhere('order.order_date >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
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
}
