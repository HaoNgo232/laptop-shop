import { IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrdersByStatusDto {
  @IsString()
  status: string;

  @IsNumber()
  @Min(0)
  count: number;
}

export class RevenueByMonthDto {
  @IsString()
  month: string;

  @IsNumber()
  @Min(0)
  revenue: number;
}

export class DetailedStatsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdersByStatusDto)
  ordersByStatus: OrdersByStatusDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RevenueByMonthDto)
  revenueByMonth: RevenueByMonthDto[];
}
