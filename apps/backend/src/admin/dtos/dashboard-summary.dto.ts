import { IDashboardSummary } from '@web-ecom/shared-types/admin/interfaces.cjs';
import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto implements IDashboardSummary {
  @ApiProperty({
    description: 'Số lượng người dùng mới trong khoảng thời gian',
    example: 25,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  newUsersCount: number;

  @ApiProperty({
    description: 'Số lượng đơn hàng mới trong khoảng thời gian',
    example: 15,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  newOrdersCount: number;

  @ApiProperty({
    description: 'Tổng doanh thu',
    example: 1500000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalRevenue: number;

  @ApiProperty({
    description: 'Tổng số người dùng',
    example: 500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalUsers: number;

  @ApiProperty({
    description: 'Tổng số đơn hàng',
    example: 250,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalOrders: number;

  @ApiProperty({
    description: 'Tổng số sản phẩm',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalProducts: number;
}
