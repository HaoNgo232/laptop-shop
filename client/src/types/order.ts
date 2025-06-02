import type { PaginatedResponse } from "@/types/api";
import type {
  OrderStatusEnum,
  PaymentStatusEnum,
  PaymentMethodEnum,
} from "@/enums/order";

export interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: string;
  order_date: Date;
  status: OrderStatusEnum;
  total_amount: number;
}

export interface OrderDetail extends Order {
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
  items: OrderItem[];
}

export interface CreateOrderRequest {
  shippingAddress: string;
  paymentMethod: PaymentMethodEnum;
  note?: string;
}

export interface CreateOrderResponse {
  order: OrderDetail;
  qrCode?: QRCodeResponse;
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

export type OrderListResponse = PaginatedResponse<Order>;

export interface CheckoutState {
  shippingAddress: string;
  paymentMethod: PaymentMethodEnum;
  isLoading: boolean;
  error: string | null;
  createdOrder: OrderDetail | null;
  qrCodeData: QRCodeResponse | null;
  paymentStatus: PaymentStatusEnum;
  pollingIntervalId: number | null;
}

export interface ShippingAddress {
  fullAddress: string;
  note?: string;
}
