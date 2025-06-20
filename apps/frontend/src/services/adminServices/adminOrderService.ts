import { apiClient } from "@/services/api";
import { Order, UpdateOrderStatus } from "@/types/order";
import { ApiError, PaginatedResponse } from "@/types/api";
import { AdminQuery } from "@/types/admin";

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
