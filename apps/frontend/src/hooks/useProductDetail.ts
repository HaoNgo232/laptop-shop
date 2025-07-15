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

  // Store hooks
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

  // Load product khi mount
  useEffect(() => {
    if (id) {
      fetchProductById(id);
      clearReviews();
    }
  }, [id, fetchProductById, clearReviews]);

  // Check user review khi có product và user đã login
  useEffect(() => {
    if (product && isAuthenticated) {
      checkUserReview(product.id);
    }
  }, [product, isAuthenticated, checkUserReview]);

  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product || !isAuthenticated) return;

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      console.log("🛒 Added to cart successfully");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle retry
  const handleRetry = () => {
    clearError();
    if (id) fetchProductById(id);
  };

  // Handle review success
  const handleReviewSuccess = () => {
    if (product) {
      checkUserReview(product.id);
      fetchProductReviews(product.id);
      setEditingReview(null);
      console.log("Review submitted successfully!");
    }
  };

  // Modal handlers
  const openReviewModal = (review?: ReviewWithUser | null) => {
    setEditingReview(review || null);
    setIsReviewModalOpen(true);
  };

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
    handleReviewSuccess,
    setEditingReview,
    openReviewModal,
    closeReviewModal,
    navigate,
  };
}
