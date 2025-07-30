import { IsNumber, Min } from 'class-validator';

export class DashboardSummaryDto {
  @IsNumber()
  @Min(0)
  newUsersCount: number;

  @IsNumber()
  @Min(0)
  newOrdersCount: number;

  @IsNumber()
  @Min(0)
  totalRevenue: number;

  @IsNumber()
  @Min(0)
  totalUsers: number;

  @IsNumber()
  @Min(0)
  totalOrders: number;

  @IsNumber()
  @Min(0)
  totalProducts: number;
}
