import { OrderItemDto } from '@/orders/dtos/order-item.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { UserBriefDto } from '@/orders/dtos/user-brief.dto';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';

import { IsNotEmpty, IsString, IsEnum, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';

export class OrderDetailDto extends OrderDto {
  @ValidateNested()
  @Type(() => UserBriefDto)
  user: UserBriefDto;

  @IsNotEmpty()
  @IsString()
  shipping_address: string;

  @IsNotEmpty()
  @IsString()
  payment_method: string;

  @IsEnum(PaymentStatusEnum)
  payment_status: PaymentStatusEnum;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
