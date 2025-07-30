import { getRankDiscountPercentage } from "@/helpers/rank.helpers";

/**
 * Tính toán giảm giá dựa trên số tiền và cấp độ người dùng.
 * Phần này chỉ hiện thị ở frontend vì backend đã tính toán giảm giá rồi
 * @param amount
 * @param userRank
 * @returns
 */
export const calculateDiscount = (amount: number, userRank: string) => {
  const discountPercentage = getRankDiscountPercentage(userRank);
  const discountAmount = amount * (discountPercentage / 100);
  const finalAmount = amount - discountAmount;

  return {
    originalAmount: amount,
    discountPercentage: discountPercentage / 100,
    discountAmount,
    finalAmount,
    userRank,
  };
};
