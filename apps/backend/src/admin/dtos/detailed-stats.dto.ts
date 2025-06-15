import { IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IDetailedStats,
  IOrdersByStatus,
  IRevenueByMonth,
} from '@web-ecom/shared-types/admin/interfaces';

export class OrdersByStatusDto implements IOrdersByStatus {
  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    example: 'PENDING',
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Số lượng đơn hàng có trạng thái này',
    example: 10,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  count: number;
}

export class RevenueByMonthDto implements IRevenueByMonth {
  @ApiProperty({
    description: 'Tháng (format: YYYY-MM)',
    example: '2024-01',
  })
  @IsString()
  month: string;

  @ApiProperty({
    description: 'Doanh thu trong tháng',
    example: 500000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  revenue: number;
}

export class DetailedStatsDto implements IDetailedStats {
  @ApiProperty({
    description: 'Thống kê đơn hàng theo trạng thái',
    type: [OrdersByStatusDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdersByStatusDto)
  ordersByStatus: OrdersByStatusDto[];

  @ApiProperty({
    description: 'Thống kê doanh thu theo tháng',
    type: [RevenueByMonthDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RevenueByMonthDto)
  revenueByMonth: RevenueByMonthDto[];
}
