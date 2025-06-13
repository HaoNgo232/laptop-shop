/**
 * Trạng thái đơn hàng - chỉ về logistics/fulfillment
 * Flow: PENDING -> PROCESSING -> SHIPPED -> DELIVERED
 *       PENDING -> CANCELLED (có thể cancel ở bất kỳ đâu)
 */
export enum OrderStatusEnum {
  PENDING = 'PENDING', // Đơn hàng mới tạo, chờ xử lý
  PROCESSING = 'PROCESSING', // Đang chuẩn bị hàng, đóng gói
  SHIPPED = 'SHIPPED', // Đã giao cho shipper
  DELIVERED = 'DELIVERED', // Đã giao thành công cho khách
  CANCELLED = 'CANCELLED', // Đơn hàng bị hủy
}
