import { apiClient } from "@/services/api";
import type { User, UpdateProfile } from "@/types/auth";

class UserService {
  // Cập nhật thông tin profile
  async updateProfile(data: UpdateProfile): Promise<User> {
    try {
      // Lọc bỏ các trường rỗng
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== "",
        ),
      ) as UpdateProfile;

      const response = await apiClient.put<User>(
        "/api/users/profile",
        cleanData,
      );
      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  // Lấy thông tin profile chi tiết
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>("/api/users/profile");
      return response;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  // Thay đổi mật khẩu
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    try {
      await apiClient.post("/api/users/change-password", data);
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
