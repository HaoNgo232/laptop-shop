import { apiClient } from "@/services/api";
import {
  AdminDetail,
  UpdateByAdmin,
  AdminQuery,
  AdminView,
  PaginatedResponse,
} from "@/types";

class AdminUserService {
  async getUsers(query: AdminQuery): Promise<PaginatedResponse<AdminView>> {
    const response = await apiClient.get<PaginatedResponse<AdminView>>(
      "/api/admin/manager-users",
      query,
    );
    return response;
  }

  async getUserById(userId: string): Promise<AdminDetail> {
    const response = await apiClient.get<AdminDetail>(
      `/api/admin/manager-users/${userId}`,
    );
    return response;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateByAdmin,
  ): Promise<AdminDetail> {
    const response = await apiClient.put<AdminDetail>(
      `/api/admin/manager-users/${userId}`,
      updateUserDto,
    );
    return response;
  }
}

export const adminUserService = new AdminUserService();
