import { Product } from '../products';

// Cart interfaces
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

// Cart DTOs
export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
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