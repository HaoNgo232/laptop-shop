import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import type { ShippingAddress } from "@/types/order";
import {
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@web-ecom/shared-types/orders/enums";

export type CheckoutStep =
  | "shipping"
  | "payment"
  | "review"
  | "processing"
  | "payment-waiting";

export function useCheckoutFlow() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { cart } = useCartStore();
  const {
    shippingAddress,
    paymentMethod,
    isLoading,
    error,
    createdOrder,
    qrCodeData,
    paymentStatus,
    setShippingAddress,
    setPaymentMethod,
    createOrder,
    resetCheckout,
    clearError,
  } = useCheckoutStore();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/checkout",
          message: "Vui lòng đăng nhập để thanh toán",
        },
      });
    }
  }, [isAuthenticated, navigate]);

  // Redirect nếu giỏ hàng trống
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  // Handle payment status changes
  useEffect(() => {
    if (paymentStatus === PaymentStatusEnum.PAID && createdOrder) {
      // Delay để user thấy success state
      setTimeout(() => {
        navigate(`/orders/${createdOrder.id}`, { replace: true });
      }, 2000);
    }
  }, [paymentStatus, createdOrder, navigate]);

  // Step navigation logic
  useEffect(() => {
    if (createdOrder && qrCodeData && paymentMethod === "SEPAY_QR") {
      setCurrentStep("payment-waiting");
    } else if (createdOrder && paymentMethod === "COD") {
      setCurrentStep("processing");
    }
  }, [createdOrder, qrCodeData, paymentMethod]);

  // Handle shipping form submit
  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep("payment");
  };

  // Handle payment method selection
  const handlePaymentSelect = (method: PaymentMethodEnum) => {
    setPaymentMethod(method);
    setCurrentStep("review");
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    await createOrder();
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping");
    } else if (currentStep === "review") {
      setCurrentStep("payment");
    } else {
      navigate("/cart");
    }
  };

  // Handle retry
  const handleRetry = () => {
    resetCheckout();
    setCurrentStep("shipping");
  };

  // Check if should show page
  const shouldShowPage = isAuthenticated && cart && cart.items.length > 0;

  return {
    // Data
    currentStep,
    shippingAddress,
    paymentMethod,
    createdOrder,
    qrCodeData,
    cart,

    // States
    isLoading,
    error,
    paymentStatus,
    shouldShowPage,

    // Actions
    handleShippingSubmit,
    handlePaymentSelect,
    handlePlaceOrder,
    handleBack,
    handleRetry,
    clearError,
  };
}
