import { PaginationMeta } from './pagination-meta.interface';

export interface PaginatedResponse<T> {
  /**
   * Dữ liệu trả về
   */
  data: T[];
  /**
   * Metadata phân trang
   */
  meta: PaginationMeta;
}
