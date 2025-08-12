import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto {
  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(0)
  newUsersCount: number;

  @ApiProperty({ example: 34 })
  @IsNumber()
  @Min(0)
  newOrdersCount: number;

  @ApiProperty({ example: 123456789 })
  @IsNumber()
  @Min(0)
  totalRevenue: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  totalUsers: number;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @Min(0)
  totalOrders: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  totalProducts: number;
}
