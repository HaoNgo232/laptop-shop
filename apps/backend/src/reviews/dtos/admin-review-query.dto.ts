import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../orders/dtos/pagination-query.dto';
import type { IAdminReviewQuery } from '@web-ecom/shared-types';

export class AdminReviewQueryDto extends PaginationQueryDto implements IAdminReviewQuery {
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
