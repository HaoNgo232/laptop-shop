import { UserRole } from "../enums";

// Base User interface
export interface User {
  id: string;
  email: string;
  username: string;
  address?: string;
  phone_number?: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export type UserProfile = Omit<User, "password_hash">;

// Auth DTOs
export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  username: string;
}

export interface UpdateProfileDto {
  username?: string;
  address?: string;
  phone_number?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Response types
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
