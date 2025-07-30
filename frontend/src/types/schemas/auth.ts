import { z } from "zod";
import {
  LoginUser,
  RegisterUser,
  UpdateProfile,
} from "@/types/interfaces/auth";

export const RegisterUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    username: z.string().min(3, "Tâên người dùng phải có ít nhất 3 ký tự"),
    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
  }) satisfies z.ZodType<RegisterUser>;

export const UpdateProfileSchema = z.object({
  username: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
}) satisfies z.ZodType<UpdateProfile>;

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
}) satisfies z.ZodType<LoginUser>;
