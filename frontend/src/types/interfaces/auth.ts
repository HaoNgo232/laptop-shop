import { UserRankEnum, UserRole } from "@/types";

/**
 * Auth-related interfaces
 * Các interface liên quan đến xác thực và quản lý người dùng
 * Được tách riêng theo Domain-Driven Design principles
 */

export interface User {
  id: string;
  email: string;
  username?: string;
  address?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
  rank: UserRankEnum;
  totalSpent: number;
}

export interface UserRankInfo {
  userId: string;
  username: string;
  userRank: UserRankEnum;
  totalSpent: number;
}

export interface DiscountInfo {
  originalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  userRank: UserRankEnum;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

export interface UpdateProfile {
  username?: string;
  address?: string;
  phoneNumber?: string;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPasswordPayload {
  sub: string;
  type: string;
  iat?: number;
  exp?: number;
}

export interface ResetPassword {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export type UserProfile = Omit<User, "passwordHash">;
