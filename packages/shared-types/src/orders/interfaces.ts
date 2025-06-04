import type { PaginatedResponse } from "../common/interfaces";
import { OrderStatusEnum, PaymentStatusEnum, PaymentMethodEnum } from "./enums";

// Order interfaces
export interface IOrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
  quantity: number;
  price_at_purchase: number;
}

export interface IOrder {
  id: string;
  order_date: Date;
  status: OrderStatusEnum;
  total_amount: number;
}

export interface IOrderDetail extends IOrder {
  user: {
    id: string;
    email: string;
    username?: string;
    phone_number?: string;
  };
  shipping_address: string;
  payment_method: PaymentMethodEnum;
  payment_status: PaymentStatusEnum;
  note?: string;
  items: IOrderItem[];
}

// Order DTOs
export interface ICreateOrderRequest {
  shippingAddress: string;
  paymentMethod: PaymentMethodEnum;
  note?: string;
}

export interface IQRCodeResponse {
  qrUrl: string;
  qrString: string;
  amount: number;
  content: string;
  bankAccount?: string;
  expireTime?: Date;
  metadata?: Record<string, any>;
}

export interface ICreateOrderResponse {
  order: IOrderDetail;
  qrCode?: IQRCodeResponse;
}

export interface IShippingAddress {
  fullAddress: string;
  note?: string;
}

export interface ICheckoutState {
  shippingAddress: string;
  paymentMethod: PaymentMethodEnum;
  isLoading: boolean;
  error: string | null;
  createdOrder: IOrderDetail | null;
  qrCodeData: IQRCodeResponse | null;
  paymentStatus: PaymentStatusEnum;
  pollingIntervalId: number | null;
}

// Response types
export type IOrderListResponse = PaginatedResponse<IOrder>;
