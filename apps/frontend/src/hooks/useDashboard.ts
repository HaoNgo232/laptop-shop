import { useEffect } from "react";
import { useAdminDashboardStore } from "@/stores/admin/adminDashboardStore";

/**
 * Hook quản lý dashboard data và logic
 * Xử lý loading data, error handling, refresh
 */
export const useDashboard = () => {
  const {
    dashboardSummary,
    detailedStats,
    isLoading,
    error,
    fetchDashboardSummary,
    fetchDetailedStats,
    clearError,
  } = useAdminDashboardStore();

  // Load dashboard data khi component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load tất cả dashboard data song song
   * Tối ưu performance bằng cách gọi API đồng thời
   */
  const loadDashboardData = async () => {
    try {
      await Promise.all([fetchDashboardSummary(), fetchDetailedStats()]);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    }
  };

  const handleRefresh = () => {
    clearError();
    loadDashboardData();
  };

  return {
    // Data
    dashboardSummary,
    detailedStats,

    // States
    isLoading,
    error,

    // Actions
    handleRefresh,
    loadDashboardData,
  };
};
