import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/auth/entities/user.entity';
import { getDiscountPercentage } from '@/orders/helpers/rank-caculatetor.helpers';
import { DiscountCalculation } from '@/orders/interfaces/discount-caculation.interface';

interface IDiscountService {
  calculate(userId: string, originalAmount: number): Promise<DiscountCalculation>;
}

/**
 * Service xử lý logic discount dựa trên rank của user
 */
@Injectable()
export class DiscountService implements IDiscountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Tính toán giảm giá dựa trên rank của user
   */
  async calculate(userId: string, originalAmount: number): Promise<DiscountCalculation> {
    // Lấy thông tin rank của user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['rank'],
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    // Lấy phần trăm giảm giá dựa trên rank của user
    const discountPercentage = getDiscountPercentage(user.rank);

    // Số tiền sẽ giảm giá
    const discountAmount = originalAmount * discountPercentage;

    // Tổng tiền sau khi giảm giá
    const finalAmount = originalAmount - discountAmount;

    return {
      originalAmount,
      discountPercentage,
      discountAmount,
      finalAmount,
      userRank: user.rank,
    };
  }
}
