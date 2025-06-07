import { CategoryBriefDto } from '@/products/dtos/category-brief.dto';
import { IProductBrief } from '@web-ecom/shared-types';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProductBriefDto implements IProductBrief {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ValidateNested()
  @Type(() => CategoryBriefDto)
  category: CategoryBriefDto;
}
