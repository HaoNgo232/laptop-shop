import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import type { UpdateReviewFields } from '@web-ecom/shared-types';

export class UpdateReviewDto implements UpdateReviewFields {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
