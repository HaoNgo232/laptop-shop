import type { PaymentStatus, PaymentMethod } from "./enums";

// Payment interfaces
export interface IPayment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

// Payment DTOs
export interface ICreatePaymentDto {
  amount: number;
  currency: string;
  method: PaymentMethod;
  orderId: string;
}

export interface IUpdatePaymentDto {
  status: PaymentStatus;
  transactionId?: string;
  failureReason?: string;
}

// Payment API responses
export interface IPaymentResponse {
  payment: IPayment;
  redirectUrl?: string;
  qrCode?: string;
}
