import { z } from "zod";
import type {
  IReview,
  IReviewWithUser,
  ICreateReview,
  IUpdateReview,
  IReviewQuery,
  IAdminReviewQuery,
  IUserBrief,
  IReviewListResponse,
} from "@web-ecom/shared-types";

export const ReviewSchema: z.ZodType<IReview> = z.object({
  id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserBriefSchema: z.ZodType<IUserBrief> = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().optional(),
});
export const ReviewWithUserSchema: z.ZodType<IReviewWithUser> = z.object({
  id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: UserBriefSchema,
  productId: z.string(),
});

export const CreateReviewSchema: z.ZodType<ICreateReview> = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const UpdateReviewSchema: z.ZodType<IUpdateReview> = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export const ReviewQuerySchema: z.ZodType<IReviewQuery> = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  productId: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
});

export const AdminReviewQuerySchema: z.ZodType<IAdminReviewQuery> = z.object({
  userId: z.string().optional(),
  productId: z.string().optional(),
});

export type Review = z.infer<typeof ReviewSchema>;
export type ReviewWithUser = z.infer<typeof ReviewWithUserSchema>;
export type CreateReview = z.infer<typeof CreateReviewSchema>;
export type UpdateReview = z.infer<typeof UpdateReviewSchema>;
export type ReviewQuery = z.infer<typeof ReviewQuerySchema>;
export type ReviewListResponse = IReviewListResponse;

export type ValidatedCreateReview = z.infer<typeof CreateReviewSchema>;
export type ValidatedUpdateReview = z.infer<typeof UpdateReviewSchema>;
export type ValidatedReviewQuery = z.infer<typeof ReviewQuerySchema>;
