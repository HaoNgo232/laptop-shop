import { IPaginationMeta } from '@web-ecom/shared-types/common/interfaces.cjs';

export type PaginationMeta = IPaginationMeta & {
  /**
   * Trang hiện tại
   */
  currentPage: number | undefined;
  /**
   * Số lượng item trên mỗi trang
   */
  itemsPerPage: number | undefined;
  /**
   * Tổng số item
   */
  totalItems: number | undefined;
  /**
   * Tổng số trang
   */
  totalPages: number | undefined;
  /**
   * Có trang trước không
   */
  hasPreviousPage: boolean | undefined;
  /**
   * Có trang sau không
   */
  hasNextPage: boolean | undefined;
};
