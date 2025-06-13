import { UserRole } from "../auth/enums";

export interface IAdminView {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminDetail {
  id: string;
  email: string;
  username: string;
  address?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateByAdmin {
  role: UserRole;
  isActive: boolean;
}

export interface IAdminQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
}

export interface IDashboardSummary {
  newUsersCount: number;
  newOrdersCount: number;
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
}

export interface IOrdersByStatus {
  status: string;
  count: number;
}

export interface IRevenueByMonth {
  month: string;
  revenue: number;
}

export interface IDetailedStats {
  ordersByStatus: IOrdersByStatus[];
  revenueByMonth: IRevenueByMonth[];
}
