import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import type { CreateReviewFields } from '@web-ecom/shared-types';

export class CreateReviewDto implements CreateReviewFields {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
