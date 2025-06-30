import { create } from "zustand";
import {
  AdminDetail,
  AdminQuery,
  AdminView,
  UpdateByAdmin,
} from "@/types/admin";
import { ApiError } from "@/types/api";
import { adminUserService } from "@/services/adminServices/adminUserService";
import { IPaginatedResponse } from "@web-ecom/shared-types/common/interfaces";

interface AdminUserState {
  // Users State
  users: IPaginatedResponse<AdminView>;
  selectedUser: AdminDetail | null;
  isLoading: boolean;
  error: string | null;

  // Users Actions
  fetchUsers: (query: AdminQuery) => Promise<void>;
  fetchUserById: (userId: string) => Promise<void>;
  updateUser: (userId: string, updateUserDto: UpdateByAdmin) => Promise<void>;
  clearSelectedUser: () => void;
  clearError: () => void;
}

export const useAdminUserStore = create<AdminUserState>((set) => ({
  // State
  users: {
    data: [],
    meta: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  },
  selectedUser: null,
  isLoading: false,
  error: null,

  // Actions
  async fetchUsers(query: AdminQuery) {
    try {
      set({ isLoading: true, error: null });
      const response = await adminUserService.getUsers(query);
      set({ users: response, isLoading: false });
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
      const response = await adminUserService.getUserById(userId);
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
      const response = await adminUserService.updateUser(userId, updateUserDto);
      set({ selectedUser: response, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể cập nhật người dùng",
        isLoading: false,
      });
    }
  },

  clearSelectedUser: () => set({ selectedUser: null }),
  clearError: () => set({ error: null }),
}));
