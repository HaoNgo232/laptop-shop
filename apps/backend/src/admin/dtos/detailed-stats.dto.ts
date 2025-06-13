import { IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IDetailedStats,
  IOrdersByStatus,
  IRevenueByMonth,
} from '@web-ecom/shared-types/admin/interfaces';

export class OrdersByStatusDto implements IOrdersByStatus {
  @IsString()
  status: string;

  @IsNumber()
  @Min(0)
  count: number;
}

export class RevenueByMonthDto implements IRevenueByMonth {
  @IsString()
  month: string;

  @IsNumber()
  @Min(0)
  revenue: number;
}

export class DetailedStatsDto implements IDetailedStats {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdersByStatusDto)
  ordersByStatus: OrdersByStatusDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RevenueByMonthDto)
  revenueByMonth: RevenueByMonthDto[];
}
