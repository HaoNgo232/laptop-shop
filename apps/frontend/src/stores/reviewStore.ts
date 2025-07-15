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
  currentProductId: string | null; // Lưu ID sản phẩm hiện tại
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
  currentProductId: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  pagination: null,

  // Lấy danh sách đánh giá của sản phẩm
  fetchProductReviews: async (productId: string, query?: ReviewQuery) => {
    try {
      set({ isLoading: true, error: null, currentProductId: productId });

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

  // Tạo đánh giá mới
  createReview: async (productId: string, reviewData: CreateReview) => {
    try {
      set({ isSubmitting: true, error: null });

      const newReview = await reviewService.createReview(productId, reviewData);

      // Reload lại list để cập nhật
      await get().fetchProductReviews(productId);

      // Cập nhật review của user
      set({
        currentUserReview: newReview,
        isSubmitting: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Không thể tạo đánh giá",
        isSubmitting: false,
      });
      throw error; // Throw lại để component biết có lỗi
    }
  },

  // Sửa đánh giá
  updateReview: async (reviewId: string, reviewData: UpdateReview) => {
    try {
      set({ isSubmitting: true, error: null });

      const updatedReview = await reviewService.updateReview(
        reviewId,
        reviewData,
      );

      // Reload lại list sau khi sửa
      const currentProductId = get().currentProductId;
      if (currentProductId) {
        await get().fetchProductReviews(currentProductId);
      }

      // Cập nhật review của user nếu đúng là review này
      set((state) => ({
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

  // Xóa đánh giá
  deleteReview: async (reviewId: string) => {
    try {
      set({ isSubmitting: true, error: null });

      await reviewService.deleteReview(reviewId);

      // Reload lại list sau khi xóa
      const currentProductId = get().currentProductId;
      if (currentProductId) {
        await get().fetchProductReviews(currentProductId);
      }

      // Xóa review của user nếu đúng là review này
      set((state) => ({
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

  // Kiểm tra user đã review chưa
  checkUserReview: async (productId: string) => {
    try {
      const userReview = await reviewService.checkUserReview(productId);
      set({ currentUserReview: userReview });
    } catch (error: any) {
      console.error("Error checking user review:", error);
      set({ currentUserReview: null });
    }
  },

  // Xóa lỗi
  clearError: () => set({ error: null }),

  // Reset về ban đầu (khi chuyển sản phẩm)
  clearReviews: () =>
    set({
      reviews: [],
      currentUserReview: null,
      currentProductId: null,
      pagination: null,
      error: null,
    }),
}));
