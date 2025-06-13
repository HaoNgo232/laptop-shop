import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { IAdminOrderQuery } from '@web-ecom/shared-types/orders/interfaces.cjs';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID, IsEnum, IsDateString, IsInt, Min } from 'class-validator';

export class AdminOrderQueryDto implements IAdminOrderQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
