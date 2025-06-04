import { CartItemDto } from '@/cart/dtos/cart-item.dto';
import { ICart } from '@web-ecom/shared-types';
import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CartDto implements ICart {
  @IsUUID()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsNumber()
  total_items: number;

  @IsNumber()
  total_price: number;
}
