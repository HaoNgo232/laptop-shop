import { create } from "zustand";
import { DashboardSummary, DetailedStats, ApiError } from "@/types";
import { adminDashboardService } from "@/services/adminServices/adminDashboardService";

interface AdminDashboardState {
  // Dashboard State
  dashboardSummary: DashboardSummary | null;
  detailedStats: DetailedStats | null;
  isLoading: boolean;
  error: string | null;

  // Dashboard Actions
  fetchDashboardSummary: () => Promise<void>;
  fetchDetailedStats: () => Promise<void>;
  clearError: () => void;
}

export const useAdminDashboardStore = create<AdminDashboardState>((set) => ({
  // State
  dashboardSummary: null,
  detailedStats: null,
  isLoading: false,
  error: null,

  // Actions
  async fetchDashboardSummary() {
    try {
      set({ isLoading: true, error: null });
      const response = await adminDashboardService.getDashboardSummary();
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
      const response = await adminDashboardService.getDetailedStats();
      set({ detailedStats: response, isLoading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || "Không thể tải thông tin chi tiết",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
