// Common API response types
export interface IApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode: number;
}

// Enhanced API response with required message
export interface IApiResponseWithMessage<T = unknown> {
  data: T;
  message: string;
  statusCode: number;
  timestamp?: string;
}

export interface IPaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}

// Enhanced paginated response with message
export interface IPaginatedResponseWithMessage<T> {
  data: T[];
  meta: IPaginationMeta;
  message: string;
}

// Error response structure
export interface IApiError {
  message: string;
  error?: string;
  statusCode: number;
}
