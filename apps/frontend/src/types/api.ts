import {
  IPaginatedResponse,
  IPaginationMeta,
} from "@web-ecom/shared-types/common/interfaces";

// Common API response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode: number;
}

export type PaginationMeta = IPaginationMeta;

export type PaginatedResponse<T> = IPaginatedResponse<T>;

// Error response structure
export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}
