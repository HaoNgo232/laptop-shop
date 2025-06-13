import { UserRole } from "./enums";

// Base interfaces for auth module
export interface IUser {
  id: string;
  email: string;
  username?: string;
  address?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRegisterUser {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

export interface IUpdateProfile {
  username?: string;
  address?: string;
  phoneNumber?: string;
}

export interface IRefreshToken {
  refreshToken: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPasswordPayload {
  sub: string;
  type: string;
  iat?: number;
  exp?: number;
}

export interface IResetPassword {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export type IUserProfile = Omit<IUser, "passwordHash">;
