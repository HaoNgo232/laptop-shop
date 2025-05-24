import { IsNumber } from 'class-validator';
import { ValidateNested } from 'class-validator';
import { ProductBriefDto } from './product-brief.dto';
import { Type } from 'class-transformer';

export class CartItemDto {
  @ValidateNested()
  @Type(() => ProductBriefDto)
  product: ProductBriefDto;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price_at_addition: number;
}
