/**
 * Trạng thái thanh toán - chỉ về payment
 * Flow: PENDING -> WAITING -> PAID
 *       PENDING -> FAILED/CANCELLED
 *       PAID -> REFUNDED (nếu cần hoàn tiền)
 */
export enum PaymentStatusEnum {
  PENDING = 'PENDING', // Chưa thanh toán
  WAITING = 'WAITING', // Đang chờ thanh toán (đã tạo QR)
  PAID = 'PAID', // Đã thanh toán thành công
  FAILED = 'FAILED', // Thanh toán thất bại
  REFUNDED = 'REFUNDED', // Đã hoàn tiền
  CANCELLED = 'CANCELLED', // Hủy thanh toán
}
