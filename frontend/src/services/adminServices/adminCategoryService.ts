import { apiClient } from "@/services/api";
import { ApiError } from "@/types";
import { Category, CreateCategory, UpdateCategory } from "@/types";

class AdminCategoryService {
  async createCategory(dto: CreateCategory): Promise<Category> {
    try {
      const response = await apiClient.post<Category>(
        "/api/admin/categories",
        dto,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }

  async updateCategory(
    categoryId: string,
    dto: UpdateCategory,
  ): Promise<Category> {
    try {
      const response = await apiClient.put<Category>(
        `/api/admin/categories/${categoryId}`,
        dto,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/categories/${categoryId}`);
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }
}

export const adminCategoryService = new AdminCategoryService();
