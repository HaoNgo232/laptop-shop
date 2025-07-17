/**
 * Lấy tên rank tiếng Việt
 * @param rank - Tên rank
 * @returns Tên rank tiếng Việt
 */
export const getRankDisplayName = (rank: string): string => {
  const rankNames = {
    BRONZE: "Đồng",
    SILVER: "Bạc",
    GOLD: "Vàng",
    DIAMOND: "Kim Cương",
  };
  return rankNames[rank as keyof typeof rankNames] || "Đồng";
};

/**
 * Lấy màu rank
 * @param rank - Tên rank
 * @returns Màu rank
 */
export const getRankColor = (rank: string): string => {
  const rankColors = {
    BRONZE: "text-amber-600 bg-amber-50",
    SILVER: "text-gray-600 bg-gray-50",
    GOLD: "text-yellow-600 bg-yellow-50",
    DIAMOND: "text-blue-600 bg-blue-50",
  };
  return (
    rankColors[rank as keyof typeof rankColors] || "text-amber-600 bg-amber-50"
  );
};

export const getRankDiscountPercentage = (rank: string): number => {
  const rankDiscounts = {
    BRONZE: 0,
    SILVER: 5,
    GOLD: 10,
    DIAMOND: 20,
  };
  return rankDiscounts[rank as keyof typeof rankDiscounts] || 0;
};
