import type { PaginatedResponse } from "@/types";

/**
 * Review-related interfaces
 */

//  Base Review interfaces - đây là "single source of truth"
export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBrief {
  id: string;
  username: string;
  avatar?: string;
}

export interface ReviewWithUser extends Review {
  user: UserBrief;
  productId: string;
}

//  DTOs for API operations
export interface CreateReview {
  rating: number;
  comment?: string;
}

export interface UpdateReview {
  rating?: number;
  comment?: string;
}

export interface ReviewQuery {
  page?: number;
  limit?: number;
  productId?: string;
  userId?: string;
  search?: string;
}

//  Admin specific interfaces
export interface AdminReviewQuery extends ReviewQuery {
  userId?: string;
  productId?: string;
}

//  Response types
export interface ReviewListResponse extends PaginatedResponse<ReviewWithUser> {}

// Extract common fields để đồng bộ giữa backend và frontend
export type ReviewEntityFields = Pick<
  Review,
  "id" | "rating" | "comment" | "createdAt" | "updatedAt"
>;
export type CreateReviewFields = Pick<CreateReview, "rating" | "comment">;
export type UpdateReviewFields = Partial<
  Pick<UpdateReview, "rating" | "comment">
>;
