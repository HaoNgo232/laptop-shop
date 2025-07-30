import { OrderItemDto } from '@/orders/dtos/order-item.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { UserBriefDto } from '@/orders/dtos/user-brief.dto';

import { IsNotEmpty, IsString, IsEnum, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';

export class OrderDetailDto extends OrderDto {
  @ValidateNested()
  @Type(() => UserBriefDto)
  user: UserBriefDto;

  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsEnum(PaymentStatusEnum)
  paymentStatus: PaymentStatusEnum;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
