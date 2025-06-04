import { UserRole } from "@web-ecom/shared-types/auth/enums";
import type {
  IUser,
  ILoginUser,
  IRegisterUser,
  IUpdateProfile,
  IRefreshToken,
  IForgotPassword,
  IResetPassword,
  IChangePassword,
  ILoginResponse,
  IJwtPayload,
} from "@web-ecom/shared-types/auth/interfaces";
import { z } from "zod";

export type User = z.infer<typeof UserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type RegisterUser = z.infer<typeof RegisterUserSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export interface LoginResponse extends ILoginResponse {}

// Zod Validation Schemas
const UserSchema: z.ZodType<IUser> = z.object({
  id: z.string().uuid(),
  email: z.string().email("Email không hợp lệ"),
  username: z
    .string()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
    .max(20, "Tên người dùng không được vượt quá 20 ký tự"),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  role: z.nativeEnum(UserRole),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const LoginUserSchema: z.ZodType<ILoginUser> = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

const RegisterUserSchema: z.ZodType<IRegisterUser> = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(
      /(?=.*\d)(?=.*[a-zA-Z])/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
    ),
  username: z
    .string()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
    .max(20, "Tên người dùng không được vượt quá 20 ký tự"),
  confirmPassword: z.string(),
});

const UpdateProfileSchema: z.ZodType<IUpdateProfile> = z.object({
  username: z
    .string()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
    .max(20, "Tên người dùng không được vượt quá 20 ký tự")
    .optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
});

const RefreshTokenSchema: z.ZodType<IRefreshToken> = z.object({
  refreshToken: z.string().min(1, "Refresh token là bắt buộc"),
});

const ForgotPasswordSchema: z.ZodType<IForgotPassword> = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
});

const ResetPasswordSchema: z.ZodType<IResetPassword> = z
  .object({
    token: z.string().min(1, "Token là bắt buộc"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /(?=.*\d)(?=.*[a-zA-Z])/,
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

const ChangePasswordSchema: z.ZodType<IChangePassword> = z
  .object({
    currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /(?=.*\d)(?=.*[a-zA-Z])/,
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

const JwtPayloadSchema: z.ZodType<IJwtPayload> = z.object({
  sub: z.string(),
  email: z.string().email(),
  role: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

// Export schemas
export { LoginUserSchema, RegisterUserSchema };
