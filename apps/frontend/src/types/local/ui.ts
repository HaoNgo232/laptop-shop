// ❌ LOCAL FRONTEND - UI-specific types
import type { Payment } from "@web-ecom/shared-types";

// Component-specific props
export interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  loading?: boolean;
  className?: string;
}

// Form state management
export interface PaymentFormData {
  amount: number;
  method: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

// UI state
export interface PaymentUIState {
  isProcessing: boolean;
  showCardFields: boolean;
  errors: Record<string, string>;
  step: "select" | "details" | "confirm" | "success";
}

// Component variants
export interface PaymentCardProps {
  payment: Payment;
  variant: "default" | "compact" | "detailed";
  onClick?: () => void;
}
