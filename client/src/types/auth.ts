import type { UserRole } from "@/types/enums";

// Base User type (mirror User entity)
export interface User {
  id: string;
  email: string;
  full_name: string;
  address?: string;
  phone_number?: string;
  role: UserRole;
  created_at: Date; // ISO date string
  updated_at: Date;
}

// Request types (từ DTOs)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  address?: string;
  phone_number?: string;
}

// Response types
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Password related
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Profile response type
export type UserProfile = Omit<User, "password_hash">;
