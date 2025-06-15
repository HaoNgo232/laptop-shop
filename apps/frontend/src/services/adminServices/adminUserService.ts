import { apiClient } from "@/services/api";
import { AdminDetail, UpdateByAdmin } from "@/types/admin";
import { AdminQuery, AdminView } from "@/types/admin";
import { ApiError, PaginatedResponse } from "@/types/api";

class AdminUserService {
  async getUsers(query: AdminQuery): Promise<PaginatedResponse<AdminView>> {
    try {
      const response = await apiClient.get<PaginatedResponse<AdminView>>(
        "/api/admin/users",
        query,
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
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
      const apiError = error as ApiError;
      alert(apiError.message);
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
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }
}

export const adminUserService = new AdminUserService();
