import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from '@/products/enums/sort.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Query parameters for product listing and filtering
 */
export class QueryProductDto {
  @ApiProperty({ 
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
    default: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page phải là số nguyên' })
  @Min(1, { message: 'Page phải lớn hơn 0' })
  page?: number;

  @ApiProperty({ 
    description: 'Number of items per page',
    example: 12,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 12 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải lớn hơn 0' })
  @Max(100, { message: 'Limit không được quá 100' })
  limit?: number;

  @ApiProperty({ 
    description: 'Filter products by category ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
    required: false 
  })
  @IsOptional()
  @IsUUID(4, { message: 'CategoryId phải là UUID hợp lệ' })
  categoryId?: string;

  @ApiProperty({ 
    description: 'Sort products by field',
    example: 'createdAt',
    required: false,
    default: 'createdAt' 
  })
  @IsOptional()
  @IsString({ message: 'SortBy phải là chuỗi' })
  sortBy?: string = 'createdAt';

  @ApiProperty({ 
    description: 'Sort order',
    enum: SortOrder,
    example: SortOrder.DESC,
    required: false,
    default: SortOrder.DESC 
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'SortOrder phải là ASC hoặc DESC' })
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiProperty({ 
    description: 'Minimum price filter (VND)',
    example: 1000000,
    minimum: 0,
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Giá tối thiểu phải là số nguyên' })
  @Min(0, { message: 'Giá tối thiểu phải lớn hơn hoặc bằng 0' })
  priceMin?: number;

  @ApiProperty({ 
    description: 'Maximum price filter (VND)',
    example: 50000000,
    minimum: 0,
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Giá tối đa phải là số nguyên' })
  @Min(0, { message: 'Giá tối đa phải lớn hơn hoặc bằng 0' })
  priceMax?: number;

  @ApiProperty({ 
    description: 'Search products by name (case-insensitive)',
    example: 'MacBook Pro',
    maxLength: 255,
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;
}
