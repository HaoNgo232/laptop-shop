import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../orders/dtos/pagination-query.dto';

export class AdminReviewQueryDto extends PaginationQueryDto {
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
