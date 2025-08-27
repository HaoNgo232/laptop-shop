import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating cart item quantity
 */
export class UpdateCartItemDto {
  @ApiProperty({ 
    description: 'New quantity for the cart item',
    example: 3,
    minimum: 1,
    maximum: 100 
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @Min(1, { message: 'Số lượng phải ít nhất là 1' })
  @Max(100, { message: 'Số lượng không được vượt quá 100' })
  quantity: number;
}
