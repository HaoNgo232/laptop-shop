import { SortOrder } from "./enums";
import type { IPaginatedResponse } from "../common/interfaces";

// Category interfaces
export interface ICategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryBrief {
  id: string;
  name: string;
}

export interface ICategoryDetail extends ICategory {
  products: IProduct[];
}

// Product interfaces
export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  category: ICategoryBrief;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductBrief {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: ICategoryBrief;
}

export interface IProductDetail extends Omit<IProduct, "category"> {
  category: ICategory;
}

// Product DTOs
export interface ICreateProduct {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: string;
}

export interface IUpdateProduct extends Partial<ICreateProduct> {
  active?: boolean;
}

// Category DTOs
export interface ICreateCategory {
  name: string;
  description?: string;
}

export interface IUpdateCategory extends Partial<ICreateCategory> {
  active?: boolean;
}

// Query DTOs
export interface IQueryProduct {
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
export type IProductListResponse = IPaginatedResponse<IProduct>;
export type ICategoryListResponse = ICategory[];
