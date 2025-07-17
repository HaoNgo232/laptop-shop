import { UserRankEnum } from '@/orders/enums/user-rank.enum';

export interface DiscountCalculation {
  originalAmount: number; // số tiền gốc
  discountPercentage: number; // phần trăm giảm giá
  discountAmount: number; // số tiền giảm giá
  finalAmount: number; // số tiền sau khi giảm giá
  userRank: UserRankEnum; // rank của user
}
