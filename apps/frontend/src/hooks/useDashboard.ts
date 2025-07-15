import { useEffect } from "react";
import { useAdminDashboardStore } from "@/stores/admin/adminDashboardStore";

/**
 * Custom hook quản lý dashboard data và business logic
 * Tách business logic khỏi UI component để dễ test và maintain
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
   * Load tất cả dashboard data song song để tối ưu performance
   */
  const loadDashboardData = async () => {
    try {
      await Promise.all([fetchDashboardSummary(), fetchDetailedStats()]);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    }
  };

  /**
   * Handle refresh data với error clearing
   */
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
