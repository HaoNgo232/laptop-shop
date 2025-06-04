import { create } from "zustand";
import { cartService } from "@/services/cartService";
import type { Cart, AddToCart, UpdateCartItem } from "@/types/cart";

// Helper function để tính toán cart summary
const _calculateCartSummary = (cart: Cart | null) => {
  return {
    totalItems: cart?.total_items || 0,
    totalPrice: cart?.total_price || 0,
  };
};

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  cartSummary: { totalItems: number; totalPrice: number };

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeCartItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,
  // Khởi tạo cartSummary
  cartSummary: { totalItems: 0, totalPrice: 0 },

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const cartData = await cartService.getCart();
      set({
        cart: cartData,
        isLoading: false,
        cartSummary: _calculateCartSummary(cartData), // Cập nhật summary
      });
    } catch (error: any) {
      set({
        cart: null,
        error: error.message || "Không thể tải giỏ hàng",
        isLoading: false,
        cartSummary: _calculateCartSummary(null), // Cập nhật summary
      });
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      set({ error: null }); // Giữ lại việc reset error nếu cần
      const request: AddToCart = { productId, quantity };
      const updatedCart = await cartService.addToCart(request);
      set({
        cart: updatedCart,
        cartSummary: _calculateCartSummary(updatedCart), // Cập nhật summary
      });
      console.log("Cart state after addToCart:", get().cart);
      console.log("Cart summary after addToCart:", get().cartSummary);
    } catch (error: any) {
      set((state) => ({
        // Cập nhật state dựa trên state trước đó để không ghi đè cartSummary không cần thiết
        ...state,
        error: error.message || "Không thể thêm sản phẩm vào giỏ hàng",
      }));
      throw error;
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      set({ error: null });
      const request: UpdateCartItem = { productId, quantity };
      const updatedCart = await cartService.updateCartItem(request);
      set({
        cart: updatedCart,
        cartSummary: _calculateCartSummary(updatedCart), // Cập nhật summary
      });
    } catch (error: any) {
      set((state) => ({
        ...state,
        error: error.message || "Không thể cập nhật giỏ hàng",
      }));
      throw error;
    }
  },

  removeCartItem: async (productId) => {
    try {
      set({ error: null });
      const updatedCart = await cartService.removeCartItem(productId);
      set({
        cart: updatedCart,
        cartSummary: _calculateCartSummary(updatedCart), // Cập nhật summary
      });
    } catch (error: any) {
      set((state) => ({
        ...state,
        error: error.message || "Không thể xóa sản phẩm khỏi giỏ hàng",
      }));
      throw error;
    }
  },

  clearCart: async () => {
    try {
      set({ error: null });
      await cartService.clearCart();
      set({
        cart: null,
        cartSummary: _calculateCartSummary(null), // Cập nhật summary
      });
    } catch (error: any) {
      set((state) => ({
        ...state,
        error: error.message || "Không thể xóa giỏ hàng",
      }));
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
