import { SortOrder } from "@/types";
import type { PaginatedResponse } from "@/types";

/**
 * Product and Category interfaces
 */

// Category interfaces
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryBrief {
  id: string;
  name: string;
}

export interface CategoryDetail extends Category {
  products: Product[];
}

// Product interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  category: CategoryBrief;
  active: boolean;
  deletedAt?: Date | null; // Soft delete
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductBrief {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: CategoryBrief;
}

export interface ProductDetail extends Omit<Product, "category"> {
  category: Category;
}

// Product DTOs
export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: string;
}

export interface UpdateProduct extends Partial<CreateProduct> {
  active?: boolean;
}

// Category DTOs
export interface CreateCategory {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategory extends Partial<CreateCategory> {
  active?: boolean;
}

// Query DTOs
export interface QueryProduct {
  page?: number;
  limit?: number;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

// Response types
export type ProductListResponse = PaginatedResponse<Product>;
export type CategoryListResponse = Category[];
