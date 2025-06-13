import { IPaginationMeta } from '@web-ecom/shared-types/common/interfaces.cjs';

export type PaginationMeta = IPaginationMeta & {
  /**
   * Trang hiện tại
   */
  currentPage: number;
  /**
   * Số lượng item trên mỗi trang
   */
  itemsPerPage: number;
  /**
   * Tổng số item
   */
  totalItems: number;
  /**
   * Tổng số trang
   */
  totalPages: number;
  /**
   * Có trang trước không
   */
  hasPreviousPage: boolean;
  /**
   * Có trang sau không
   */
  hasNextPage: boolean;
};
