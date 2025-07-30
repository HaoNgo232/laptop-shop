/**
 * Common interfaces cho API responses và pagination
 */

// Common API response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode: number;
}

// Enhanced API response with required message
export interface ApiResponseWithMessage<T = unknown> {
  data: T;
  message: string;
  statusCode: number;
  timestamp?: string;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Enhanced paginated response with message
export interface PaginatedResponseWithMessage<T> {
  data: T[];
  meta: PaginationMeta;
  message: string;
}

// Error response structure
export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}
