import { OrderStatusEnum } from "@web-ecom/shared-types";

export const getOrderStatusLabel = (status: OrderStatusEnum): string => {
  const statusLabels = {
    [OrderStatusEnum.PENDING]: "Chờ xử lý",
    [OrderStatusEnum.PROCESSING]: "Đang xử lý",
    [OrderStatusEnum.SHIPPED]: "Đang giao",
    [OrderStatusEnum.DELIVERED]: "Đã giao",
    [OrderStatusEnum.CANCELLED]: "Đã hủy",
  };

  return statusLabels[status] || status;
};
