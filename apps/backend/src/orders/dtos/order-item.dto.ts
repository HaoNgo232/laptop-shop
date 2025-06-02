import { ProductBriefDto } from '@/orders/dtos/product-brief.dto';

import { IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ValidateNested()
  @Type(() => ProductBriefDto)
  @IsNotEmpty()
  product: ProductBriefDto;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price_at_purchase: number;
}
