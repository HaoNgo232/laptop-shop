import { apiClient } from "@/services/api";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  OrderDetail,
  OrderListResponse,
} from "@/types/order";

class OrderService {
  // Tạo đơn hàng mới
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      console.log("Tạo đơn hàng với request:", request);
      const response = await apiClient.post<CreateOrderResponse>(
        "/api/orders",
        request,
      );
      console.log("Đơn hàng đã được tạo thành công! response:", response);
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      throw error;
    }
  }

  // Lấy danh sách đơn hàng của user hiện tại
  async getUserOrders(params?: {
    page?: number;
    limit?: number;
  }): Promise<OrderListResponse> {
    try {
      const response = await apiClient.get<OrderListResponse>(
        "/api/orders",
        params,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      throw error;
    }
  }

  // Lấy chi tiết đơn hàng theo id
  async getOrderById(orderId: string): Promise<OrderDetail> {
    try {
      const response = await apiClient.get<OrderDetail>(
        `/api/orders/${orderId}`,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      throw error;
    }
  }

  // Hủy đơn hàng
  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.delete<Order>(
        `/api/orders/${orderId}/cancel`,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      throw error;
    }
  }

  // Polling để check payment status
  async checkPaymentStatus(orderId: string): Promise<OrderDetail> {
    try {
      const response = await apiClient.get<OrderDetail>(
        `/api/orders/${orderId}/check-payment-status`,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
