import type { Product } from "@/types/product";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price_at_addition: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  productId: string;
  quantity: number;
}

export interface CartResponse {
  data: Cart;
  message?: string;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
}
