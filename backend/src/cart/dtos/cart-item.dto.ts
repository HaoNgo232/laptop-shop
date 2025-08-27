import { IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductBriefDto } from '@/orders/dtos/product-brief.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Cart item DTO representing a product in the shopping cart
 */
export class CartItemDto {
  @ApiProperty({ 
    description: 'Unique cart item identifier',
    example: '450e8400-e29b-41d4-a716-446655440001',
    format: 'uuid' 
  })
  @IsUUID()
  id: string;

  @ApiProperty({ 
    description: 'Product information',
    type: () => ProductBriefDto 
  })
  @ValidateNested()
  @Type(() => ProductBriefDto)
  product: ProductBriefDto;

  @ApiProperty({ 
    description: 'Quantity of this product in cart',
    example: 3,
    minimum: 1 
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({ 
    description: 'Product price when added to cart (VND)',
    example: 15990000 
  })
  @IsNumber()
  priceAtAddition: number;
}
