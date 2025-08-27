import { CartItemDto } from '@/cart/dtos/cart-item.dto';
import { IsArray, IsNumber, IsUUID, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Shopping cart DTO with all cart information
 */
export class CartDto {
  @ApiProperty({ 
    description: 'Unique cart identifier',
    example: '350e8400-e29b-41d4-a716-446655440002',
    format: 'uuid' 
  })
  @IsUUID()
  id: string;

  @ApiProperty({ 
    description: 'List of products in the cart',
    type: () => [CartItemDto],
    isArray: true 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty({ 
    description: 'Total number of items in cart',
    example: 5,
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  totalItems: number;

  @ApiProperty({ 
    description: 'Total price of all items in cart (VND)',
    example: 47970000,
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  totalPrice: number;
}
