import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryProductDto {
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
  sortBy?: string = 'created_at';

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
