import { create } from "zustand";
import {
  AdminQuery,
  Order,
  UpdateOrderStatus,
  ApiError,
  PaginatedResponse,
} from "@/types";
import { adminOrderService } from "@/services/adminServices/adminOrderService";
import { orderService } from "@/services/orderService";

interface AdminOrderState {
  // Orders State
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Pagination State
  currentPage: number;
  totalPages: number;
  totalItems: number;

  // Orders Actions
  fetchOrders: (query: AdminQuery) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatus,
  ) => Promise<void>;
  setCurrentPage: (page: number) => void;
  clearSelectedOrder: () => void;
  clearError: () => void;
}

export const useAdminOrderStore = create<AdminOrderState>((set, get) => ({
  // State
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,

  // Actions
  async fetchOrders(query: AdminQuery) {
    try {
      set({ isLoading: true, error: null });
      const response: PaginatedResponse<Order> =
        await adminOrderService.getOrders(query);
      set({
        orders: response.data,
        currentPage: response.meta.currentPage,
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
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

  setCurrentPage: (page: number) => set({ currentPage: page }),

  clearSelectedOrder: () => set({ selectedOrder: null }),
  clearError: () => set({ error: null }),
}));
