import { SortOrder } from "./enums";
import type { PaginatedResponse } from "../common/interfaces";

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
  stock_quantity: number;
  image_url: string;
  category: ICategoryBrief;
  createdAt: string;
  updatedAt: string;
}

export interface IProductBrief {
  id: string;
  name: string;
  price: number;
  image_url?: string;
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
  stock_quantity: number;
  image_url: string;
  category_id: string;
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
  category_id?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  price_min?: number;
  price_max?: number;
  search?: string;
}

// Response types
export type IProductListResponse = PaginatedResponse<IProduct>;
export type ICategoryListResponse = ICategory[];
