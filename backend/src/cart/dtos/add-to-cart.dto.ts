import { IsNumber, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for adding items to cart
 */
export class AddToCartDto {
  @ApiProperty({ 
    description: 'ID of the product to add to cart',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid' 
  })
  @IsUUID(4, { message: 'ProductId phải là UUID hợp lệ' })
  productId: string;

  @ApiProperty({ 
    description: 'Quantity of the product to add',
    example: 2,
    minimum: 1,
    maximum: 100 
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @Min(1, { message: 'Số lượng phải ít nhất là 1' })
  @Max(100, { message: 'Số lượng không được vượt quá 100' })
  quantity: number;
}
