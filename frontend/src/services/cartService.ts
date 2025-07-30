import { apiClient } from "./api";
import type { Cart, CartResponse, AddToCart, UpdateCartItem } from "@/types";

class CartService {
  // Lấy giỏ hàng hiện tại
  async getCart(): Promise<Cart> {
    try {
      const response = await apiClient.get<CartResponse>("/api/cart");

      return response as unknown as Cart;
    } catch (error) {
      console.error("Get cart error");
      throw error;
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(request: AddToCart): Promise<Cart> {
    try {
      const response = await apiClient.post<CartResponse>(
        "/api/cart/items",
        request,
      );

      return response as unknown as Cart;
    } catch (error) {
      console.error("Add to cart error");
      throw error;
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ
  async updateCartItem(request: UpdateCartItem): Promise<Cart> {
    try {
      const response = await apiClient.put<CartResponse>(
        `/api/cart/items/${request.productId}`,
        request,
      );

      return response as unknown as Cart;
    } catch (error) {
      console.error("Update cart item error");
      throw error;
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async removeCartItem(productId: string): Promise<Cart> {
    try {
      const response = await apiClient.delete<CartResponse>(
        `/api/cart/items/${productId}`,
      );

      return response as unknown as Cart;
    } catch (error) {
      console.error("Remove cart item error");
      throw error;
    }
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(): Promise<void> {
    try {
      await apiClient.delete("/api/cart");
    } catch (error) {
      console.error("Clear cart error");
      throw error;
    }
  }
}

export const cartService = new CartService();
