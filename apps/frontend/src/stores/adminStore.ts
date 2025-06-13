import { create } from "zustand";
import {
  AdminDetail,
  AdminQuery,
  AdminView,
  DashboardSummary,
  DetailedStats,
  UpdateByAdmin,
} from "@/types/admin";
import {
  Category,
  CreateCategory,
  CreateProduct,
  Product,
  UpdateCategory,
  UpdateProduct,
} from "@/types/product";
import { Order, UpdateOrderStatus } from "@/types/order";
import { ApiError } from "@/types/api";
import { adminService } from "@/services/adminService";

interface AdminState {
  // Dashboard State
  dashboardSummary: DashboardSummary | null;
  detailedStats: DetailedStats | null;

  // Users State
  users: AdminView[];
  selectedUser: AdminDetail | null;

  // Products State
  adminProducts: Product[];

  // Orders State
  adminOrders: Order[];
  selectedOrder: Order | null;

  // Categories State
  adminCategories: Category[];

  // Common State
  isLoading: boolean;
  error: string | null;

  // Dashboard Actions
  fetchDashboardSummary: () => Promise<void>;
  fetchDetailedStats: () => Promise<void>;

  // Users Actions
  fetchUsers: (query: AdminQuery) => Promise<void>;
  fetchUserById: (userId: string) => Promise<void>;
  updateUser: (userId: string, updateUserDto: UpdateByAdmin) => Promise<void>;

  // Products Actions
  createProduct: (createProductDto: CreateProduct) => Promise<void>;
  updateProduct: (
    productId: string,
    updateProductDto: UpdateProduct,
  ) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Orders Actions
  fetchAdminOrders: (query: AdminQuery) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatus,
  ) => Promise<void>;

  // Categories Actions
  createCategory: (createCategoryDto: CreateCategory) => Promise<void>;
  updateCategory: (
    categoryId: string,
    updateCategoryDto: UpdateCategory,
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;

  // Common Actions
  clearError: () => void;
  clearSelectedUser: () => void;
  clearSelectedOrder: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Dashboard State
  dashboardSummary: null,
  detailedStats: null,

  // Users State
  users: [],
  selectedUser: null,

  // Products State
  adminProducts: [],

  // Orders State
  adminOrders: [],
  selectedOrder: null,

  // Categories State
  adminCategories: [],

  // Common State
  isLoading: false,
  error: null,

  // Dashboard Actions
  async fetchDashboardSummary() {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.getDashboardSummary();
      set({ dashboardSummary: response, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tải thông tin tổng quan",
        isLoading: false,
      });
    }
  },

  async fetchDetailedStats() {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.getDetailedStats();
      set({ detailedStats: response, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tải thông tin chi tiết",
        isLoading: false,
      });
    }
  },

  async fetchUsers(query: AdminQuery) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.getUsers(query);
      set({ users: response.data, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tải danh sách người dùng",
        isLoading: false,
      });
    }
  },

  async fetchUserById(userId: string) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.getUserById(userId);
      set({ selectedUser: response, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tải chi tiết người dùng",
        isLoading: false,
      });
    }
  },

  async updateUser(userId: string, updateUserDto: UpdateByAdmin) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.updateUser(userId, updateUserDto);
      set({ selectedUser: response, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể cập nhật người dùng",
        isLoading: false,
      });
    }
  },

  async createProduct(createProductDto: CreateProduct) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.createProduct(createProductDto);
      const { adminProducts } = get();
      set({
        adminProducts: [...adminProducts, response],
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tạo sản phẩm",
        isLoading: false,
      });
    }
  },

  async updateProduct(productId: string, updateProductDto: UpdateProduct) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.updateProduct(
        productId,
        updateProductDto,
      );
      const { adminProducts } = get();
      set({
        adminProducts: adminProducts.map((product) =>
          product.id === productId ? response : product,
        ),
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể cập nhật sản phẩm",
        isLoading: false,
      });
    }
  },

  async deleteProduct(productId: string) {
    try {
      set({ isLoading: true, error: null });
      await adminService.deleteProduct(productId);
      const { adminProducts } = get();
      set({
        adminProducts: adminProducts.filter(
          (product) => product.id !== productId,
        ),
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể xóa sản phẩm",
        isLoading: false,
      });
    }
  },

  async createCategory(createCategoryDto: CreateCategory) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.createCategory(createCategoryDto);
      const { adminCategories } = get();
      set({
        adminCategories: [...adminCategories, response],
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tạo danh mục",
        isLoading: false,
      });
    }
  },

  async updateCategory(categoryId: string, updateCategoryDto: UpdateCategory) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.updateCategory(
        categoryId,
        updateCategoryDto,
      );
      const { adminCategories } = get();
      set({
        adminCategories: adminCategories.map((category) =>
          category.id === categoryId ? response : category,
        ),
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể cập nhật danh mục",
        isLoading: false,
      });
    }
  },

  async deleteCategory(categoryId: string) {
    try {
      set({ isLoading: true, error: null });
      await adminService.deleteCategory(categoryId);
      const { adminCategories } = get();
      set({
        adminCategories: adminCategories.filter(
          (category) => category.id !== categoryId,
        ),
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể xóa danh mục",
        isLoading: false,
      });
    }
  },

  // Orders Actions - using correct method names from interface
  async fetchAdminOrders(query: AdminQuery) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminService.getOrders(query);
      set({
        adminOrders: response.data,
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
      const response = await adminService.getOrderById(orderId);
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
      const response = await adminService.updateOrder(
        orderId,
        updateOrderStatusDto,
      );
      const { adminOrders } = get();
      set({
        selectedOrder: response,
        adminOrders: adminOrders.map((order) =>
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

  // Common Actions
  clearError: () => set({ error: null }),
  clearSelectedUser: () => set({ selectedUser: null }),
  clearSelectedOrder: () => set({ selectedOrder: null }),
}));
