// Order enums
export enum OrderStatusEnum {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatusEnum {
  PENDING = "PENDING",
  WAITING = "WAITING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethodEnum {
  SEPAY_QR = "SEPAY_QR",
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
}
