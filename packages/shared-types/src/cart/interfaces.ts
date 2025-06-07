import { type IProductBrief } from "../products/interfaces";

// Cart interfaces
export interface ICartItem {
  id: string;
  product: IProductBrief;
  quantity: number;
  priceAtAddition: number;
}

export interface ICart {
  id: string;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
}

// Cart DTOs
export interface IAddToCart {
  productId: string;
  quantity: number;
}

export interface IUpdateCartItem {
  productId: string;
  quantity: number;
}

// Response types
export interface ICartResponse {
  data: ICart;
  message?: string;
}

export interface ICartSummary {
  totalItems: number;
  totalPrice: number;
}
