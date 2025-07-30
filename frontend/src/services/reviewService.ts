import { apiClient } from "./api";
import type {
  ReviewWithUser,
  CreateReview,
  UpdateReview,
  ReviewQuery,
  PaginatedResponse,
} from "@/types";

class ReviewService {
  // Lấy reviews cho một sản phẩm
  async getProductReviews(
    productId: string,
    query?: ReviewQuery,
  ): Promise<PaginatedResponse<ReviewWithUser>> {
    const params = new URLSearchParams();

    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());

    const queryString = params.toString();
    const url = `/api/reviews/${productId}${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient.get<PaginatedResponse<ReviewWithUser>>(url);
  }

  //  Tạo review mới
  async createReview(
    productId: string,
    reviewData: CreateReview,
  ): Promise<ReviewWithUser> {
    return apiClient.post<ReviewWithUser>(
      `/api/reviews/${productId}`,
      reviewData,
    );
  }

  // Cập nhật review
  async updateReview(
    reviewId: string,
    reviewData: UpdateReview,
  ): Promise<ReviewWithUser> {
    return apiClient.put<ReviewWithUser>(
      `/api/reviews/${reviewId}`,
      reviewData,
    );
  }
  // Xóa review
  async deleteReview(reviewId: string): Promise<void> {
    return apiClient.delete(`/api/reviews/${reviewId}`);
  }

  //  Check xem user đã review sản phẩm chưa
  async checkUserReview(productId: string): Promise<ReviewWithUser | null> {
    try {
      return apiClient.get<ReviewWithUser | null>(
        `/api/reviews/${productId}/user-review`,
      );
    } catch (error) {
      console.error("Error checking user review:", error);
      return null;
    }
  }
}

export const reviewService = new ReviewService();
