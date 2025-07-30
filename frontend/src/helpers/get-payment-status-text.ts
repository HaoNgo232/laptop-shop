import { PaymentStatusEnum } from "@/types";

export const getPaymentStatusText = (status: PaymentStatusEnum) => {
  switch (status) {
    case PaymentStatusEnum.PAID:
      return "Đã thanh toán";
    case PaymentStatusEnum.PENDING:
      return "Chờ thanh toán";
    case PaymentStatusEnum.WAITING:
      return "Đang chờ thanh toán";
    case PaymentStatusEnum.FAILED:
      return "Thanh toán thất bại";
    case PaymentStatusEnum.CANCELLED:
      return "Đã hủy thanh toán";
    default:
      return status;
  }
};
