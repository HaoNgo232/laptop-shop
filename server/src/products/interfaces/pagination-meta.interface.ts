export interface PaginationMeta {
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
}
