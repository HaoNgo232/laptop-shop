import { OrderStatusEnum } from "@web-ecom/shared-types";

export const getOrderStatusLabel = (status: OrderStatusEnum): string => {
  const statusLabels = {
    [OrderStatusEnum.PENDING]: "Chờ xử lý",
    [OrderStatusEnum.PROCESSING]: "Đang chuẩn bị hàng",
    [OrderStatusEnum.SHIPPED]: "Đã giao cho vận chuyển",
    [OrderStatusEnum.DELIVERED]: "Khách đã nhận hàng",
    [OrderStatusEnum.CANCELLED]: "Đã hủy",
  };

  return statusLabels[status] || status;
};
