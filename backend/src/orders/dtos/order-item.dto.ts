import { ProductBriefDto } from '@/orders/dtos/product-brief.dto';

import { IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ type: () => ProductBriefDto })
  @ValidateNested()
  @Type(() => ProductBriefDto)
  @IsNotEmpty()
  product: ProductBriefDto;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 15990000 })
  @IsNumber()
  @IsPositive()
  priceAtPurchase: number;
}
