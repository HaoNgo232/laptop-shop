import { OrderItemDto } from '@/orders/dtos/order-item.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { UserBriefDto } from '@/orders/dtos/user-brief.dto';

import { IsNotEmpty, IsString, IsEnum, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailDto extends OrderDto {
  @ApiProperty({ type: () => UserBriefDto })
  @ValidateNested()
  @Type(() => UserBriefDto)
  user: UserBriefDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @ApiProperty({ enum: PaymentStatusEnum })
  @IsEnum(PaymentStatusEnum)
  paymentStatus: PaymentStatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ type: () => [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
