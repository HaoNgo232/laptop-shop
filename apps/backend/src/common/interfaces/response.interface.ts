export interface ApiResponse<T = any> {
  data: T;
  message: string;
  statusCode: number;
  timestamp?: string;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
