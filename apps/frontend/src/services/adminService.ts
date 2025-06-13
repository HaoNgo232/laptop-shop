import { apiClient } from "@/services/api";
import {
  AdminDetail,
  AdminQuery,
  AdminView,
  DashboardSummary,
  DetailedStats,
  UpdateByAdmin,
} from "@/types/admin";
import { PaginatedResponse } from "@/types/api";
import { Order, UpdateOrderStatus } from "@/types/order";
import {
  Category,
  CreateCategory,
  CreateProduct,
  Product,
  UpdateCategory,
  UpdateProduct,
} from "@/types/product";
class AdminService {
  // Dashboard APIs
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<DashboardSummary>(
        "/api/admin/dashboard/summary",
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy tổng quan:", error);
      throw error;
    }
  }

  async getDetailedStats(): Promise<DetailedStats> {
    try {
      const response = await apiClient.get<DetailedStats>(
        "/api/admin/dashboard/detailed-stats",
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết:", error);
      throw error;
    }
  }

  async getUsers(query: AdminQuery): Promise<PaginatedResponse<AdminView>> {
    try {
      const response = await apiClient.get<PaginatedResponse<AdminView>>(
        "/api/admin/users",
        query,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<AdminDetail> {
    try {
      const response = await apiClient.get<AdminDetail>(
        `/api/admin/users/${userId}`,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hồ sơ admin:", error);
      throw error;
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateByAdmin,
  ): Promise<AdminDetail> {
    try {
      const response = await apiClient.put<AdminDetail>(
        `/api/admin/users/${userId}`,
        updateUserDto,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ admin:", error);
      throw error;
    }
  }

  // Product APIs

  async createProduct(createProductDto: CreateProduct): Promise<Product> {
    try {
      const response = await apiClient.post<Product>(
        "/api/admin/products",
        createProductDto,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      throw error;
    }
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProduct,
  ): Promise<Product> {
    try {
      const response = await apiClient.put<Product>(
        `/api/admin/products/${productId}`,
        updateProductDto,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/products/${productId}`);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw error;
    }
  }

  // Category APIs

  async createCategory(createCategoryDto: CreateCategory): Promise<Category> {
    try {
      const response = await apiClient.post<Category>(
        "/api/admin/categories",
        createCategoryDto,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      throw error;
    }
  }

  async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategory,
  ): Promise<Category> {
    try {
      const response = await apiClient.put<Category>(
        `/api/admin/categories/${categoryId}`,
        updateCategoryDto,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      throw error;
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/categories/${categoryId}`);
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      throw error;
    }
  }

  // Order APIs
  async getOrders(query: AdminQuery): Promise<PaginatedResponse<Order>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Order>>(
        "/api/admin/orders",
        query,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.get<Order>(
        `/api/admin/orders/${orderId}`,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      throw error;
    }
  }

  async updateOrder(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatus,
  ): Promise<Order> {
    try {
      const response = await apiClient.put<Order>(
        `/api/admin/orders/${orderId}/status`,
        updateOrderStatusDto,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
