import { create } from "zustand";
import { cartService } from "@/services/cartService";
import type { Cart, AddToCartDto, UpdateCartItemDto } from "@/types/cart";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Computed values
  get cartSummary(): { totalItems: number; totalPrice: number };

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

  get cartSummary() {
    const cart = get().cart;
    return {
      totalItems: cart?.total_items || 0,
      totalPrice: cart?.total_price || 0,
    };
  },

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const cartData = await cartService.getCart();
      set({ cart: cartData, isLoading: false });
    } catch (error: any) {
      set({
        cart: null,
        error: error.message || "Không thể tải giỏ hàng",
        isLoading: false,
      });
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      set({ error: null });
      const request: AddToCartDto = { productId, quantity };
      const updatedCart = await cartService.addToCart(request);
      set({ cart: updatedCart });
    } catch (error: any) {
      set({ error: error.message || "Không thể thêm sản phẩm vào giỏ hàng" });
      throw error;
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      set({ error: null });
      const request: UpdateCartItemDto = { productId, quantity };
      const updatedCart = await cartService.updateCartItem(request);
      set({ cart: updatedCart });
    } catch (error: any) {
      set({ error: error.message || "Không thể cập nhật giỏ hàng" });
      throw error;
    }
  },

  removeCartItem: async (productId) => {
    try {
      set({ error: null });
      const updatedCart = await cartService.removeCartItem(productId);
      set({ cart: updatedCart });
    } catch (error: any) {
      set({ error: error.message || "Không thể xóa sản phẩm khỏi giỏ hàng" });
      throw error;
    }
  },

  clearCart: async () => {
    try {
      set({ error: null });
      await cartService.clearCart();
      set({ cart: null });
    } catch (error: any) {
      set({ error: error.message || "Không thể xóa giỏ hàng" });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
