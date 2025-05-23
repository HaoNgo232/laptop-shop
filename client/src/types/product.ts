import type { SortOrder } from "@/types/enums";
import type { PaginatedResponse } from "@/types/api";

// Category types
export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryBrief {
  id: string;
  name: string;
}

export interface CategoryDetail extends Category {
  products: Product[];
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  category: CategoryBrief;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends Omit<Product, "category"> {
  category: Category;
}

// Request types
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  category_id: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  active?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  active?: boolean;
}

// Query types
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category_id?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  price_min?: number;
  price_max?: number;
  search?: string;
}

// Response types
export type ProductListResponse = PaginatedResponse<Product>;
export type CategoryListResponse = Category[];
