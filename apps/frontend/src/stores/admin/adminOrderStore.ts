import { create } from "zustand";
import { AdminQuery } from "@/types/admin";
import { Order, UpdateOrderStatus } from "@/types/order";
import { ApiError } from "@/types/api";
import { adminOrderService } from "@/services/adminServices/adminOrderService";
import { orderService } from "@/services/orderService";

interface AdminOrderState {
  // Orders State
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Orders Actions
  fetchOrders: (query: AdminQuery) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatus,
  ) => Promise<void>;
  clearSelectedOrder: () => void;
  clearError: () => void;
}

export const useAdminOrderStore = create<AdminOrderState>((set, get) => ({
  // State
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,

  // Actions
  async fetchOrders(query: AdminQuery) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminOrderService.getOrders(query);
      set({
        orders: response.data,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể lấy danh sách đơn hàng",
        isLoading: false,
      });
    }
  },

  async fetchOrderById(orderId: string) {
    try {
      set({ isLoading: true, error: null });
      const response = await orderService.getOrderById(orderId);
      set({
        selectedOrder: response,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể lấy chi tiết đơn hàng",
        isLoading: false,
      });
    }
  },

  async updateOrderStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatus,
  ) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminOrderService.updateOrder(
        orderId,
        updateOrderStatusDto,
      );
      const { orders } = get();
      set({
        selectedOrder: response,
        orders: orders.map((order) =>
          order.id === orderId ? response : order,
        ),
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể cập nhật đơn hàng",
        isLoading: false,
      });
    }
  },

  clearSelectedOrder: () => set({ selectedOrder: null }),
  clearError: () => set({ error: null }),
}));
