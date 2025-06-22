import { create } from "zustand";
import { reviewService } from "@/services/reviewService";
import type {
  ReviewWithUser,
  CreateReview,
  UpdateReview,
  ReviewQuery,
} from "@/types/review";
import type { PaginationMeta } from "@/types/api";

interface ReviewState {
  // State
  reviews: ReviewWithUser[];
  currentUserReview: ReviewWithUser | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  pagination: PaginationMeta | null;

  // Actions
  fetchProductReviews: (
    productId: string,
    query?: ReviewQuery,
  ) => Promise<void>;
  createReview: (productId: string, reviewData: CreateReview) => Promise<void>;
  updateReview: (reviewId: string, reviewData: UpdateReview) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  checkUserReview: (productId: string) => Promise<void>;
  clearError: () => void;
  clearReviews: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  // Initial state
  reviews: [],
  currentUserReview: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  pagination: null,

  //  Fetch reviews cho một sản phẩm
  fetchProductReviews: async (productId: string, query?: ReviewQuery) => {
    try {
      set({ isLoading: true, error: null });

      const response = await reviewService.getProductReviews(productId, query);

      set({
        reviews: response.data,
        pagination: response.meta,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Không thể tải đánh giá",
        isLoading: false,
      });
    }
  },

  //  Tạo review mới
  createReview: async (productId: string, reviewData: CreateReview) => {
    try {
      set({ isSubmitting: true, error: null });

      const newReview = await reviewService.createReview(productId, reviewData);

      set((state) => ({
        reviews: [newReview, ...state.reviews],
        currentUserReview: newReview,
        isSubmitting: false,
      }));
    } catch (error: any) {
      set({
        error: error?.message || "Không thể tạo đánh giá",
        isSubmitting: false,
      });
      throw error; // Re-throw để component có thể handle
    }
  },

  // Cập nhật review
  updateReview: async (reviewId: string, reviewData: UpdateReview) => {
    try {
      set({ isSubmitting: true, error: null });

      const updatedReview = await reviewService.updateReview(
        reviewId,
        reviewData,
      );

      set((state) => ({
        reviews: state.reviews.map((review) =>
          review.id === reviewId ? updatedReview : review,
        ),
        currentUserReview:
          state.currentUserReview?.id === reviewId
            ? updatedReview
            : state.currentUserReview,
        isSubmitting: false,
      }));
    } catch (error: any) {
      set({
        error: error?.message || "Không thể cập nhật đánh giá",
        isSubmitting: false,
      });
      throw error;
    }
  },

  //  Xóa review
  deleteReview: async (reviewId: string) => {
    try {
      set({ isSubmitting: true, error: null });

      await reviewService.deleteReview(reviewId);

      set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== reviewId),
        currentUserReview:
          state.currentUserReview?.id === reviewId
            ? null
            : state.currentUserReview,
        isSubmitting: false,
      }));
    } catch (error: any) {
      set({
        error: error?.message || "Không thể xóa đánh giá",
        isSubmitting: false,
      });
      throw error;
    }
  },

  //  Kiểm tra review của user hiện tại
  checkUserReview: async (productId: string) => {
    try {
      const userReview = await reviewService.checkUserReview(productId);
      set({ currentUserReview: userReview });
    } catch (error: any) {
      console.error("Error checking user review:", error);
      set({ currentUserReview: null });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  //  Clear reviews (khi chuyển sản phẩm)
  clearReviews: () =>
    set({
      reviews: [],
      currentUserReview: null,
      pagination: null,
      error: null,
    }),
}));
