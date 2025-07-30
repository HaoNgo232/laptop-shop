import { type ProductBrief } from "@/types";

/**
 * Cart-related interfaces
 */

// Cart interfaces
export interface CartItem {
  id: string;
  product: ProductBrief;
  quantity: number;
  priceAtAddition: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Cart DTOs
export interface AddToCart {
  productId: string;
  quantity: number;
}

export interface UpdateCartItem {
  productId: string;
  quantity: number;
}

// Response types
export interface CartResponse {
  data: Cart;
  message?: string;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
}
