import type { ReviewWithUser, ReviewQuery } from "@/types";
import type { PaginatedResponse } from "@/types";
import { apiClient } from "@/services/api";

class AdminReviewService {
  async getReviews(
    query: ReviewQuery,
  ): Promise<PaginatedResponse<ReviewWithUser>> {
    const params = new URLSearchParams();

    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.userId) params.append("userId", query.userId);
    if (query.productId) params.append("productId", query.productId);
    if (query.search) params.append("search", query.search);

    const queryString = params.toString();
    const url = `admin/reviews${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<PaginatedResponse<ReviewWithUser>>(url);
  }

  //  Xóa review (Admin)
  async deleteReview(reviewId: string): Promise<void> {
    return apiClient.delete(`admin/reviews/${reviewId}`);
  }
}

export const adminReviewService = new AdminReviewService();
