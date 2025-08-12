import { CartItemDto } from '@/cart/dtos/cart-item.dto';
import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CartDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({ type: () => [CartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty({ example: 3 })
  @IsNumber()
  totalItems: number;

  @ApiProperty({ example: 29990000 })
  @IsNumber()
  totalPrice: number;
}
