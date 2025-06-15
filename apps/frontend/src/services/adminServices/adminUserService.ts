import { apiClient } from "@/services/api";
import { AdminDetail, UpdateByAdmin } from "@/types/admin";
import { AdminQuery, AdminView } from "@/types/admin";
import { PaginatedResponse } from "@/types/api";

class AdminUserService {
  async getUsers(query: AdminQuery): Promise<PaginatedResponse<AdminView>> {
    const response = await apiClient.get<PaginatedResponse<AdminView>>(
      "/api/admin/users",
      query,
    );
    return response;
  }

  async getUserById(userId: string): Promise<AdminDetail> {
    const response = await apiClient.get<AdminDetail>(
      `/api/admin/users/${userId}`,
    );
    return response;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateByAdmin,
  ): Promise<AdminDetail> {
    const response = await apiClient.put<AdminDetail>(
      `/api/admin/users/${userId}`,
      updateUserDto,
    );
    return response;
  }
}

export const adminUserService = new AdminUserService();
