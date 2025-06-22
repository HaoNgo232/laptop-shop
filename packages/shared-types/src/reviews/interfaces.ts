import type { IPaginatedResponse } from "../common/interfaces";

// ✅ Base Review interfaces - đây là "single source of truth"
export interface IReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserBrief {
  id: string;
  username: string;
  avatar?: string;
}

export interface IReviewWithUser extends IReview {
  user: IUserBrief;
  productId: string;
}

// ✅ DTOs for API operations
export interface ICreateReview {
  rating: number;
  comment?: string;
}

export interface IUpdateReview {
  rating?: number;
  comment?: string;
}

export interface IReviewQuery {
  page?: number;
  limit?: number;
  productId?: string;
  userId?: string;
  search?: string;
}

// ✅ Admin specific interfaces
export interface IAdminReviewQuery extends IReviewQuery {
  userId?: string;
  productId?: string;
}

// ✅ Response types
export interface IReviewListResponse
  extends IPaginatedResponse<IReviewWithUser> {}

// ✅ Extract types - đây là pattern để đồng bộ type safety
// Backend entities sẽ extend từ đây, Frontend sẽ import trực tiếp
export type ReviewEntityFields = Pick<
  IReview,
  "id" | "rating" | "comment" | "createdAt" | "updatedAt"
>;
export type CreateReviewFields = Pick<ICreateReview, "rating" | "comment">;
export type UpdateReviewFields = Partial<
  Pick<IUpdateReview, "rating" | "comment">
>;
export type UserBriefFields = Pick<IUserBrief, "id" | "username" | "avatar">;

// ✅ Type guards để validate runtime
export const isValidRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

export const isValidReview = (obj: any): obj is ICreateReview => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.rating === "number" &&
    isValidRating(obj.rating) &&
    (obj.comment === undefined || typeof obj.comment === "string")
  );
};
