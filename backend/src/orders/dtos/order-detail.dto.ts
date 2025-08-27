import { OrderItemDto } from '@/orders/dtos/order-item.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { UserBriefDto } from '@/orders/dtos/user-brief.dto';

import { IsNotEmpty, IsString, IsEnum, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Detailed order information including items and user data
 */
export class OrderDetailDto extends OrderDto {
  @ApiProperty({ 
    description: 'Customer information who placed the order',
    type: () => UserBriefDto 
  })
  @ValidateNested()
  @Type(() => UserBriefDto)
  user: UserBriefDto;

  @ApiProperty({ 
    description: 'List of ordered items with quantities and prices',
    type: () => [OrderItemDto],
    isArray: true 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ 
    description: 'Order creation timestamp',
    example: '2025-08-27T10:30:00.000Z',
    format: 'date-time' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last order update timestamp',
    example: '2025-08-27T11:45:00.000Z',
    format: 'date-time' 
  })
  updatedAt: Date;
}
