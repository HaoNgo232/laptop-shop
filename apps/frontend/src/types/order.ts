import {
  OrderStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@web-ecom/shared-types/orders/enums";
import type {
  IOrder,
  IOrderDetail,
  IOrderItem,
  ICreateOrderRequest,
  IQRCodeResponse,
  ICreateOrderResponse,
  IShippingAddress,
  ICheckoutState,
  IOrderListResponse,
} from "@web-ecom/shared-types/orders/interfaces";
import { z } from "zod";

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type QRCodeResponse = z.infer<typeof QRCodeResponseSchema>;
export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type CheckoutState = z.infer<typeof CheckoutStateSchema>;

// Response types
export interface OrderListResponse extends IOrderListResponse {}

// Zod Validation Schemas
const OrderItemSchema: z.ZodType<IOrderItem> = z.object({
  product: z.object({
    id: z.string().uuid(),
    name: z.string(),
    price: z.number().positive(),
    image_url: z.string().url().optional(),
  }),
  quantity: z.number().int().positive("Số lượng phải lớn hơn 0"),
  price_at_purchase: z.number().positive(),
});

const OrderSchema: z.ZodType<IOrder> = z.object({
  id: z.string().uuid(),
  order_date: z.date(),
  status: z.nativeEnum(OrderStatusEnum),
  total_amount: z.number().positive("Tổng tiền phải lớn hơn 0"),
});

const OrderDetailSchema: z.ZodType<IOrderDetail> = z.object({
  id: z.string().uuid(),
  order_date: z.date(),
  status: z.nativeEnum(OrderStatusEnum),
  total_amount: z.number().positive("Tổng tiền phải lớn hơn 0"),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string().optional(),
    phone_number: z.string().optional(),
  }),
  shipping_address: z.string().min(1, "Địa chỉ giao hàng là bắt buộc"),
  payment_method: z.nativeEnum(PaymentMethodEnum),
  payment_status: z.nativeEnum(PaymentStatusEnum),
  note: z.string().optional(),
  items: z.array(OrderItemSchema).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm"),
});

const CreateOrderRequestSchema: z.ZodType<ICreateOrderRequest> = z.object({
  shippingAddress: z
    .string()
    .min(10, "Địa chỉ giao hàng phải có ít nhất 10 ký tự"),
  paymentMethod: z.nativeEnum(PaymentMethodEnum),
  note: z.string().max(500, "Ghi chú không được vượt quá 500 ký tự").optional(),
});

const QRCodeResponseSchema: z.ZodType<IQRCodeResponse> = z.object({
  qrUrl: z.string().url("QR URL không hợp lệ"),
  qrString: z.string(),
  amount: z.number().positive(),
  content: z.string(),
  bankAccount: z.string().optional(),
  expireTime: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

const CreateOrderResponseSchema: z.ZodType<ICreateOrderResponse> = z.object({
  order: OrderDetailSchema,
  qrCode: QRCodeResponseSchema.optional(),
});

const ShippingAddressSchema: z.ZodType<IShippingAddress> = z.object({
  fullAddress: z.string().min(10, "Địa chỉ đầy đủ phải có ít nhất 10 ký tự"),
  note: z.string().max(200, "Ghi chú không được vượt quá 200 ký tự").optional(),
});

const CheckoutStateSchema: z.ZodType<ICheckoutState> = z.object({
  shippingAddress: z.string(),
  paymentMethod: z.nativeEnum(PaymentMethodEnum),
  isLoading: z.boolean(),
  error: z.string().nullable(),
  createdOrder: OrderDetailSchema.nullable(),
  qrCodeData: QRCodeResponseSchema.nullable(),
  paymentStatus: z.nativeEnum(PaymentStatusEnum),
  pollingIntervalId: z.number().nullable(),
});
