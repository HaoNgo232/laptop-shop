import { PaginationMeta } from '@/products/interfaces/pagination-meta.interface';
import { IPaginatedResponse } from '@web-ecom/shared-types/common/interfaces.cjs';

export type PaginatedResponse<T> = IPaginatedResponse<T> & {
  /**
   * Dữ liệu trả về
   */
  data: T[];
  /**
   * Metadata phân trang
   */
  meta: PaginationMeta;
};
