import { PaginationMeta } from '@/common/interfaces/response.interface';

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
