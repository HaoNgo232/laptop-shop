import { apiClient } from "@/services/api";
import { DashboardSummary, DetailedStats } from "@/types/admin";
import { ApiError } from "@/types/api";
class AdminDashboardService {
  // Dashboard APIs
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<DashboardSummary>(
        "/api/admin/dashboard/summary",
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message);
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
      const apiError = error as ApiError;
      alert(apiError.message);
      throw error;
    }
  }
}

export const adminDashboardService = new AdminDashboardService();
