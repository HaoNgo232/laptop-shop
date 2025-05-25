import type { Product } from "@/types/product";

// Cart Item - sản phẩm trong giỏ hàng
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price_at_addition: number;
}

// Cart - toàn bộ giỏ hàng
export interface Cart {
  id: string;
  items: CartItem[];
  total_items: number; // Match với backend snake_case
  total_price: number; // Match với backend snake_case
}

// Request types để thêm/cập nhật cart
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

// Response types
export interface CartResponse {
  data: Cart;
  message?: string;
}

// Cart summary cho MiniCart - computed values
export interface CartSummary {
  totalItems: number;
  totalPrice: number;
}
