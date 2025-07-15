import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useReviewStore } from "@/stores/reviewStore";
import type { ReviewWithUser } from "@/types/review";

export function useProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Store hooks (lấy dữ liệu từ store)
  const {
    selectedProduct: product,
    isLoading,
    error,
    fetchProductById,
    clearError,
  } = useProductStore();

  const { addToCart, cartSummary } = useCartStore();
  const {
    currentUserReview,
    checkUserReview,
    clearReviews,
    fetchProductReviews,
  } = useReviewStore();

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewWithUser | null>(
    null,
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Load product khi mount (khi chuyển sản phẩm)
  useEffect(() => {
    if (id) {
      fetchProductById(id);
      clearReviews();
    }
  }, [id, fetchProductById, clearReviews]);

  // Kiểm tra user đã review chưa
  useEffect(() => {
    if (product && isAuthenticated) {
      checkUserReview(product.id);
    }
  }, [product, isAuthenticated, checkUserReview]);

  // Xử lý số lượng
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      // Có thể thêm thông báo thành công ở đây
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Xử lý back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Xử lý retry
  const handleRetry = () => {
    if (id) fetchProductById(id);
  };

  // Xử lý modal review
  const openReviewModal = (review?: ReviewWithUser) => {
    setEditingReview(review || null);
    setIsReviewModalOpen(true);
  };

  // Xử lý đóng modal review
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setEditingReview(null);
  };

  return {
    // Data
    id,
    product,
    currentUserReview,
    quantity,
    editingReview,
    cartSummary,

    // States
    isLoading,
    error,
    isAddingToCart,
    isAuthenticated,
    isReviewModalOpen,

    // Actions
    handleQuantityChange,
    handleAddToCart,
    handleBack,
    handleRetry,
    openReviewModal,
    closeReviewModal,
    navigate,
  };
}
