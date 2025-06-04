import type {
  CreateOrderRequest,
  OrderDetail,
  QRCodeResponse,
  ShippingAddress,
} from "@/types/order";
import { create } from "zustand";
import { orderService } from "@/services/orderService";
import { useCartStore } from "@/stores/cartStore";
import type { ApiError } from "@/types/api";
import {
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@web-ecom/shared-types/orders/enums";

interface CheckoutState {
  // State
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethodEnum | null;
  isLoading: boolean;
  error: string | null;
  createdOrder: OrderDetail | null;
  qrCodeData: QRCodeResponse | null;
  paymentStatus: PaymentStatusEnum;
  pollingIntervalId: NodeJS.Timeout | null;

  // Actions
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: PaymentMethodEnum) => void;
  createOrder: () => Promise<void>;
  startPaymentPolling: (orderId: string) => void;
  stopPaymentPolling: () => void;
  resetCheckout: () => void;
  clearError: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  shippingAddress: null,
  paymentMethod: null,
  isLoading: false,
  error: null,
  createdOrder: null,
  qrCodeData: null,
  paymentStatus: PaymentStatusEnum.PENDING,
  pollingIntervalId: null,

  setShippingAddress: (address: ShippingAddress) =>
    set({ shippingAddress: address }),

  setPaymentMethod: (method: PaymentMethodEnum) =>
    set({ paymentMethod: method }),

  createOrder: async () => {
    const { shippingAddress, paymentMethod } = get();
    if (!shippingAddress || !paymentMethod) {
      set({ error: "Vui lòng điền đầy đủ thông tin giao hàng và thanh toán!" });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const request: CreateOrderRequest = {
        shippingAddress: shippingAddress.fullAddress,
        paymentMethod: paymentMethod,
        note: shippingAddress.note,
      };

      const response = await orderService.createOrder(request);

      set({ createdOrder: response.order });

      if (response.qrCode) {
        set({
          qrCodeData: response.qrCode,
          paymentStatus: PaymentStatusEnum.WAITING,
        });
        // Bắt đầu polling cho SEPAY_QR
        if (paymentMethod === "SEPAY_QR") {
          get().startPaymentPolling(response.order.id);
        }
      } else {
        set({ paymentStatus: PaymentStatusEnum.PAID });
        // Clear cart ngay lập tức cho COD
        const cartStore = useCartStore.getState();
        await cartStore.clearCart();
      }
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Đặt hàng thất bại",
        paymentStatus: PaymentStatusEnum.FAILED,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  startPaymentPolling: (orderId) => {
    // Clear existing polling nếu có
    const currentIntervalId = get().pollingIntervalId;
    if (currentIntervalId) {
      clearInterval(currentIntervalId);
    }

    const intervalId = setInterval(async () => {
      try {
        const orderDetail = await orderService.checkPaymentStatus(orderId);

        if (orderDetail.payment_status === PaymentStatusEnum.PAID) {
          set({
            paymentStatus: PaymentStatusEnum.PAID,
            createdOrder: orderDetail,
          });
          get().stopPaymentPolling();
          // Clear cart khi thanh toán thành công
          const cartStore = useCartStore.getState();
          await cartStore.clearCart();
        } else if (
          orderDetail.payment_status === PaymentStatusEnum.FAILED ||
          orderDetail.payment_status === PaymentStatusEnum.CANCELLED
        ) {
          set({ paymentStatus: PaymentStatusEnum.FAILED });
          get().stopPaymentPolling();
        }
      } catch (error) {
        console.error("Polling payment status failed:", error);
        // Không dừng polling ngay, có thể là lỗi tạm thời
      }
    }, 5000); // Poll mỗi 5 giây

    set({ pollingIntervalId: intervalId });

    // Auto stop sau 10 phút (timeout)
    setTimeout(
      () => {
        const currentStatus = get().paymentStatus;
        if (currentStatus === PaymentStatusEnum.WAITING) {
          get().stopPaymentPolling();
          set({
            paymentStatus: PaymentStatusEnum.FAILED,
            error: "Thời gian chờ thanh toán đã hết. Vui lòng thử lại.",
          });
        }
      },
      10 * 60 * 1000,
    );
  },

  stopPaymentPolling: () => {
    const intervalId = get().pollingIntervalId;
    if (intervalId) {
      clearInterval(intervalId);
      set({ pollingIntervalId: null });
    }
  },

  resetCheckout: () => {
    get().stopPaymentPolling();
    set({
      shippingAddress: null,
      paymentMethod: null,
      createdOrder: null,
      qrCodeData: null,
      paymentStatus: PaymentStatusEnum.PENDING,
      error: null,
      isLoading: false,
    });
  },

  clearError: () => set({ error: null }),
}));

// Cleanup effect - gọi khi app unmount
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    const checkoutStore = useCheckoutStore.getState();
    checkoutStore.stopPaymentPolling();
  });
}
