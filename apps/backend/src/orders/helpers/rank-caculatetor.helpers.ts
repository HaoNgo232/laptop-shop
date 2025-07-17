import { UserRankEnum } from '@/orders/enums/user-rank.enum';

/**
 * Tính toán xếp hạng người dùng dựa vào số tiền đã chỉnh sửa
 * @param totalSpent - Số tiền đã chỉnh sửa
 * @returns Xếp hạng người dùng
 */
export const calculateUserRank = (totalSpent: number): UserRankEnum => {
  if (totalSpent >= 3000) {
    // tạm để là 3k VND
    return UserRankEnum.DIAMOND;
  } else if (totalSpent >= 2000) {
    // tạm để là 2k VND
    return UserRankEnum.GOLD;
  } else if (totalSpent >= 1000) {
    // tạm để là 1k VND
    return UserRankEnum.SILVER;
  }
  return UserRankEnum.BRONZE; // mặc định là BRONZE
};

/**
 * Lấy phần trăm giảm giá dựa vào xếp hạng người dùng
 * @param tier - Xếp hạng người dùng
 * @returns Phần trăm giảm giá
 */
export function getDiscountPercentage(tier: UserRankEnum): number {
  switch (tier) {
    case UserRankEnum.SILVER:
      return 0.05; // 5%
    case UserRankEnum.GOLD:
      return 0.1; // 10%
    case UserRankEnum.DIAMOND:
      return 0.2; // 20%
    case UserRankEnum.BRONZE:
    default:
      return 0; // mặc định là 0%
  }
}
