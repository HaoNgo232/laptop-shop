import { UserRole } from "@/types";

/**
 * Admin-related interfaces
 */

export interface AdminView {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminDetail {
  id: string;
  email: string;
  username: string;
  address?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateByAdmin {
  role: UserRole;
  isActive: boolean;
}

export interface AdminQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
}

export interface DashboardSummary {
  newUsersCount: number;
  newOrdersCount: number;
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
}

export interface DetailedStats {
  ordersByStatus: OrdersByStatus[];
  revenueByMonth: RevenueByMonth[];
}
