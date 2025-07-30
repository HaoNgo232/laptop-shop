import { IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductBriefDto } from '@/orders/dtos/product-brief.dto';

export class CartItemDto {
  @IsUUID()
  id: string;

  @ValidateNested()
  @Type(() => ProductBriefDto)
  product: ProductBriefDto;

  @IsNumber()
  quantity: number;

  @IsNumber()
  priceAtAddition: number;
}
