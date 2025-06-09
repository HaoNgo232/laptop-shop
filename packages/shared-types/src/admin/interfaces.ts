import { UserRole } from "../auth/enums";

export interface IAdminUserView {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminUserDetail {
  id: string;
  email: string;
  username: string;
  address?: string;
  phoneNumber?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUserByAdmin {
  role: UserRole;
  isActive: boolean;
}

export interface IAdminUserQuery {
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
