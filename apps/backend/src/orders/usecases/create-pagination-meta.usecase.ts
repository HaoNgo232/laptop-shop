import { PaginationMeta } from '@/common/interfaces/response.interface';

export class CreatePaginationMetaUseCase {
  execute(total: number, page: number, limit: number, search?: string): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }
}
