// Payment enums
export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  DELIVERED = "DELIVERED",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  PAYPAL = "paypal",
  BANK_TRANSFER = "bank_transfer",
  CASH_ON_DELIVERY = "cod",
}
