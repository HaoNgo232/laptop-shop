import { apiClient } from "./api";
import type {
  Cart,
  CartResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "@/types/cart";

class CartService {
  // Lấy giỏ hàng hiện tại
  async getCart(): Promise<Cart> {
    try {
      console.log("🌐 Making GET request to /api/cart");
      const response = await apiClient.get<CartResponse>("/api/cart");
      console.log("🌐 Raw response from /api/cart:", response);

      // Backend trả về direct CartDto, không wrap trong data
      return response as unknown as Cart;
    } catch (error) {
      console.error("Get cart error:", error);
      throw error;
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    try {
      console.log("🌐 Making POST request to /api/cart/items:", request);
      const response = await apiClient.post<CartResponse>(
        "/api/cart/items",
        request,
      );
      console.log("🌐 Raw response from /api/cart/items:", response);

      // Backend trả về direct CartDto, không wrap trong data
      return response as unknown as Cart;
    } catch (error) {
      console.error("Add to cart error:", error);
      throw error;
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ
  async updateCartItem(request: UpdateCartItemRequest): Promise<Cart> {
    try {
      const response = await apiClient.put<CartResponse>(
        `/api/cart/items/${request.productId}`,
        { quantity: request.quantity },
      );

      // Backend trả về direct CartDto, không wrap trong data
      return response as unknown as Cart;
    } catch (error) {
      console.error("Update cart item error:", error);
      throw error;
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async removeCartItem(productId: string): Promise<Cart> {
    try {
      const response = await apiClient.delete<CartResponse>(
        `/api/cart/items/${productId}`,
      );

      // Backend trả về direct CartDto, không wrap trong data
      return response as unknown as Cart;
    } catch (error) {
      console.error("Remove cart item error:", error);
      throw error;
    }
  }

  // Xóa toàn bộ giỏ hàng
  async clearCart(): Promise<void> {
    try {
      await apiClient.delete("/api/cart");
    } catch (error) {
      console.error("Clear cart error:", error);
      throw error;
    }
  }
}

export const cartService = new CartService();
