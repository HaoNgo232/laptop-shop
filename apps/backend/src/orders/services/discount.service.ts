import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/auth/entities/user.entity';
import { getDiscountPercentage } from '@/orders/helpers/rank-caculatetor.helpers';
import { DiscountCalculation } from '@/orders/interfaces/discount-caculation.interface';

interface IDiscountService {
  calculateDiscount(userId: string, originalAmount: number): Promise<DiscountCalculation>;
  applyDiscount(userId: string, originalAmount: number): Promise<number>;
  getUserDiscountPercentage(userId: string): Promise<number>;
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
   * Tính toán discount dựa trên rank của user
   */
  async calculateDiscount(userId: string, originalAmount: number): Promise<DiscountCalculation> {
    // Lấy thông tin rank của user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['rank'],
    });

    if (!user) {
      throw new Error('User không tồn tại');
    }

    const discountPercentage = getDiscountPercentage(user.rank);
    const discountAmount = originalAmount * discountPercentage;
    const finalAmount = originalAmount - discountAmount;

    return {
      originalAmount,
      discountPercentage,
      discountAmount,
      finalAmount,
      userRank: user.rank,
    };
  }

  /**
   * Áp dụng discount vào số tiền (helper method)
   */
  async applyDiscount(userId: string, originalAmount: number): Promise<number> {
    const calculation = await this.calculateDiscount(userId, originalAmount);
    return calculation.finalAmount;
  }

  /**
   * Lấy discount percentage cho một user cụ thể
   */
  async getUserDiscountPercentage(userId: string): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['rank'],
    });

    if (!user) {
      throw new Error('User không tồn tại');
    }

    return getDiscountPercentage(user.rank);
  }
}
