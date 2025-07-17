import { getRankDiscountPercentage } from "@/helpers/rank.helpers";

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
