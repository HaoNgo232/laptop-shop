import { PaymentStatus, PaymentMethod } from "../enums";

// ✅ SHARED - cả FE và BE cần cho API
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  created_at: Date;
  updated_at: Date;
}

// ✅ SHARED - DTOs cho API
export interface CreatePaymentDto {
  amount: number;
  currency: string;
  method: PaymentMethod;
  orderId: string;
}

export interface UpdatePaymentDto {
  status: PaymentStatus;
  transactionId?: string;
  failureReason?: string;
}

// ✅ SHARED - API responses
export interface PaymentResponse {
  payment: Payment;
  redirectUrl?: string;
  qrCode?: string;
}
