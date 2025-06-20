import type {
  IPaginatedResponse,
  IPaginatedResponseWithMessage,
} from "../common/interfaces";
import { OrderStatusEnum, PaymentStatusEnum, PaymentMethodEnum } from "./enums";

// Order interfaces
export interface IOrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder {
  id: string;
  orderDate: Date;
  status: OrderStatusEnum;
  totalAmount: number;
}

export interface IOrderDetail extends IOrder {
  user: {
    id: string;
    email: string;
    username?: string;
    phoneNumber?: string;
  };
  shippingAddress: string;
  paymentMethod: PaymentMethodEnum;
  paymentStatus: PaymentStatusEnum;
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
  phoneNumber: string;
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
export type IOrderListResponse = IPaginatedResponse<IOrder>;
export type IOrderListResponseWithMessage =
  IPaginatedResponseWithMessage<IOrder>;

export interface IAdminOrderQuery {
  page?: number;

  limit?: number;

  status?: OrderStatusEnum;

  userId?: string;

  search?: string;

  dateFrom?: string;

  dateTo?: string;
}

export interface IUpdateOrderStatus {
  status: OrderStatusEnum;
}
