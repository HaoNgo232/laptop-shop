import type { SortOrder } from "@/enums/product";
import type { PaginatedResponse } from "@/types/api";

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

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  category_id: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  active?: boolean;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  active?: boolean;
}

export interface QueryProductDto {
  page?: number;
  limit?: number;
  category_id?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  price_min?: number;
  price_max?: number;
  search?: string;
}

export type ProductListResponse = PaginatedResponse<Product>;
export type CategoryListResponse = Category[];
