// Order enums
/**
 * Trạng thái đơn hàng - chỉ về logistics/fulfillment
 * Flow: PENDING -> PROCESSING -> SHIPPED -> DELIVERED
 *       PENDING -> CANCELLED (có thể cancel ở bất kỳ đâu)
 */
export enum OrderStatusEnum {
  PENDING = "PENDING", // Đơn hàng mới tạo, chờ xử lý
  PROCESSING = "PROCESSING", // Đang chuẩn bị hàng, đóng gói
  SHIPPED = "SHIPPED", // Đã giao cho shipper
  DELIVERED = "DELIVERED", // Đã giao thành công cho khách
  CANCELLED = "CANCELLED", // Đơn hàng bị hủy
}

export enum PaymentStatusEnum {
  PENDING = "PENDING", // Chưa thanh toán
  WAITING = "WAITING", // Đang chờ thanh toán (đã tạo QR)
  PAID = "PAID", // Đã thanh toán thành công
  FAILED = "FAILED", // Thanh toán thất bại
  REFUNDED = "REFUNDED", // Đã hoàn tiền
  CANCELLED = "CANCELLED", // Hủy thanh toán
}

export enum PaymentMethodEnum {
  SEPAY_QR = "SEPAY_QR",
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
}
