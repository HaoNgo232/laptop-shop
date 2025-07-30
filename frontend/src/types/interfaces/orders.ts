import type { PaginatedResponse, PaginatedResponseWithMessage } from "@/types";
import { OrderStatusEnum, PaymentStatusEnum, PaymentMethodEnum } from "@/types";

/**
 * Order-related interfaces
 */

// Order interfaces
export interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  orderDate: Date;
  status: OrderStatusEnum;
  totalAmount: number;
}

export interface OrderDetail extends Order {
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
  items: OrderItem[];
}

// Order DTOs
export interface CreateOrderRequest {
  shippingAddress: string;
  paymentMethod: PaymentMethodEnum;
  note?: string;
}

export interface QRCodeResponse {
  qrUrl: string;
  qrString: string;
  amount: number;
  content: string;
  bankAccount?: string;
  expireTime?: Date;
  metadata?: Record<string, any>;
}

export interface CreateOrderResponse {
  order: OrderDetail;
  qrCode?: QRCodeResponse;
}

export interface ShippingAddress {
  fullAddress: string;
  phoneNumber: string;
  note?: string;
}

export interface ICheckoutState {
  shippingAddress: string;
  paymentMethod: PaymentMethodEnum;
  isLoading: boolean;
  error: string | null;
  createdOrder: OrderDetail | null;
  qrCodeData: QRCodeResponse | null;
  paymentStatus: PaymentStatusEnum;
  pollingIntervalId: number | null;
}

// Response types
export type OrderListResponse = PaginatedResponse<Order>;
export type OrderListResponseWithMessage = PaginatedResponseWithMessage<Order>;

export interface AdminOrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatusEnum;
  userId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UpdateOrderStatus {
  status: OrderStatusEnum;
}
