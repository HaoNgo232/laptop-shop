import { ApiProperty } from '@nestjs/swagger';

/**
 * Pagination metadata for API responses
 */
export class PaginationMetaDto {
  @ApiProperty({ 
    description: 'Current page number',
    example: 1,
    minimum: 1 
  })
  currentPage: number;

  @ApiProperty({ 
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100 
  })
  itemsPerPage: number;

  @ApiProperty({ 
    description: 'Total number of items',
    example: 150 
  })
  totalItems: number;

  @ApiProperty({ 
    description: 'Total number of pages',
    example: 15 
  })
  totalPages: number;

  @ApiProperty({ 
    description: 'Whether there is a previous page',
    example: false 
  })
  hasPreviousPage: boolean;

  @ApiProperty({ 
    description: 'Whether there is a next page',
    example: true 
  })
  hasNextPage: boolean;
}

/**
 * Generic paginated response DTO
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ 
    description: 'Array of data items',
    isArray: true 
  })
  data: T[];

  @ApiProperty({ 
    description: 'Pagination metadata',
    type: PaginationMetaDto 
  })
  meta: PaginationMetaDto;

  @ApiProperty({ 
    description: 'Response message',
    example: 'Data retrieved successfully',
    required: false 
  })
  message?: string;
}