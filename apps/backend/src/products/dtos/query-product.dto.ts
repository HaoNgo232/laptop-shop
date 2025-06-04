import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { IQueryProduct } from '@web-ecom/shared-types/products/interfaces';
import { SortOrder } from '@web-ecom/shared-types/products/enums';

export class QueryProductDto implements IQueryProduct {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price_max?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
