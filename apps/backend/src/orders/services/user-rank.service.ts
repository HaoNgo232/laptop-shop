import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/auth/entities/user.entity';
import { Order } from '@/orders/entities/order.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { calculateUserRank } from '@/orders/helpers/rank-caculatetor.helpers';
import { UserRankEnum } from '@/orders/enums/user-rank.enum';

interface IUserRankService {
  updateAllRanks(): Promise<void>;
  updateRank(userId: string): Promise<boolean>;
  getRankInfo(userId: string): Promise<{
    userId: string;
    username: string;
    userRank: UserRankEnum;
    totalSpent: number;
  }>;
  forceUpdateRanks(): Promise<void>;
}

/**
 * Cập nhật xếp hạng người dùng dựa trên tổng số tiền đã chi tiêu
 */
@Injectable()
export class UserRankService implements IUserRankService {
  private readonly logger = new Logger(UserRankService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Cron job chạy mỗi 10 phút để cập nhật rank cho tất cả users
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateAllRanks(): Promise<void> {
    this.logger.log('Bắt đầu cập nhật rank cho tất cả users...');

    try {
      // Lấy tất cả users
      const users = await this.userRepository.find();

      this.logger.log(`Tìm thấy ${users.length} users để cập nhật rank`);

      // Cập nhật rank cho tất cả users
      const updatedCount = await this.processUpdates(users);

      this.logger.log(
        `Hoàn thành cập nhật rank. ${updatedCount}/${users.length} users được cập nhật.`,
      );
    } catch (error) {
      this.logger.error('Lỗi khi cập nhật rank cho users:', error);
    }
  }

  /**
   * Cập nhật rank cho một user cụ thể
   * @param userId ID của user
   * @returns true nếu có thay đổi, false nếu không
   */
  async updateRank(userId: string): Promise<boolean> {
    try {
      const totalSpent = await this.calculateTotalSpent(userId);
      const newTier = calculateUserRank(totalSpent);

      // Lấy thông tin user hiện tại
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        this.logger.warn(`Không tìm thấy user với ID: ${userId}`);
        return false;
      }

      // Kiểm tra xem có thay đổi không
      const hasChanged = this.checkChange(user, totalSpent, newTier);

      if (hasChanged) {
        await this.updateUserData(userId, totalSpent, newTier, user.username);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Lỗi khi cập nhật rank cho user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Lấy thông tin rank hiện tại của user (để hiển thị trên frontend)
   */
  async getRankInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'rank', 'totalSpent'],
    });

    if (!user) {
      throw new Error('User không tồn tại');
    }

    return {
      userId: user.id,
      username: user.username,
      userRank: user.rank,
      totalSpent: user.totalSpent,
    };
  }

  /**
   * Manual trigger để test hoặc chạy ngay lập tức
   */
  async forceUpdateRanks(): Promise<void> {
    this.logger.log('Manual trigger - bắt đầu cập nhật rank...');
    await this.updateAllRanks();
  }

  /**
   * Cập nhật rank cho tất cả users
   */
  private async processUpdates(users: User[]): Promise<number> {
    let updatedCount = 0;

    for (const user of users) {
      const wasUpdated = await this.updateRank(user.id);
      if (wasUpdated) {
        updatedCount++;
      }
    }

    return updatedCount;
  }

  /**
   * Tính tổng số tiền đã chi từ các đơn hàng hoàn thành
   */
  private async calculateTotalSpent(userId: string): Promise<number> {
    const totalSpentResult: { totalSpent: string } | undefined = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalSpent')
      .where('order.userId = :userId', { userId })
      .andWhere('order.status = :status', { status: OrderStatusEnum.DELIVERED })
      .getRawOne();

    return parseFloat(totalSpentResult?.totalSpent || '0');
  }

  /**
   * Cập nhật thông tin user
   */
  private async updateUserData(
    userId: string,
    totalSpent: number,
    newTier: UserRankEnum,
    username: string,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      totalSpent,
      rank: newTier,
    });

    this.logger.log(`Updated user ${username}: totalSpent=${totalSpent}, tier=${newTier}`);
  }

  /**
   * Kiểm tra xem có thay đổi không
   */
  private checkChange(user: User, totalSpent: number, newTier: UserRankEnum): boolean {
    return user.totalSpent !== totalSpent || user.rank !== newTier;
  }
}
