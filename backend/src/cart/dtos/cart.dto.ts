import { CartItemDto } from '@/cart/dtos/cart-item.dto';
import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CartDto {
  @IsUUID()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsNumber()
  totalItems: number;

  @IsNumber()
  totalPrice: number;
}
