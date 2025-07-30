/**
 * Utility functions cho formatting data
 */

/**
 * Format số tiền theo định dạng Việt Nam (VND)
 * @param amount - Số tiền cần format
 * @returns Chuỗi tiền tệ đã format
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Format số với dấu phân cách hàng nghìn
 * @param value - Số cần format
 * @returns Chuỗi số đã format
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

/**
 * Format phần trăm với 1 chữ số thập phân
 * @param value - Giá trị phần trăm (0-100)
 * @returns Chuỗi phần trăm đã format
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
};
