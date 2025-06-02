import { z } from "zod";

// Login Schema - mirror backend validation
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

// Register Schema - match backend RegisterUserDto
export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/(?=.*\d)(?=.*[a-zA-Z])/, "Mật khẩu phải chứa chữ và số"),
    username: z
      .string()
      .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
      .max(20, "Tên người dùng không được vượt quá 20 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Profile Update Schema
export const ProfileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
    .max(20, "Tên người dùng không được vượt quá 20 ký tự")
    .optional(),
  address: z
    .string()
    .min(3, "Địa chỉ phải có ít nhất 3 ký tự")
    .max(100, "Địa chỉ không được vượt quá 100 ký tự")
    .optional(),
  phone_number: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
});

// Forgot Password Schema
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
});

// Reset Password Schema
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token không hợp lệ"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/(?=.*\d)(?=.*[a-zA-Z])/, "Mật khẩu phải chứa chữ và số"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Export types
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type ProfileUpdateFormData = z.infer<typeof ProfileUpdateSchema>;
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
