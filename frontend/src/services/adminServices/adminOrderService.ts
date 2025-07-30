import { apiClient } from "@/services/api";
import { Order, UpdateOrderStatus } from "@/types";
import { ApiError, PaginatedResponse } from "@/types";
import { AdminQuery } from "@/types";

class AdminOrderService {
  // Order APIs
  async getOrders(query: AdminQuery): Promise<PaginatedResponse<Order>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Order>>(
        "/api/admin/orders",
        query,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }

  async updateOrder(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatus,
  ): Promise<Order> {
    try {
      const response = await apiClient.patch<Order>(
        `/api/admin/orders/${orderId}/status`,
        updateOrderStatusDto,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }
}

export const adminOrderService = new AdminOrderService();
