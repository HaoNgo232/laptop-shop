export class OrdersByStatusDto {
  status: string;
  count: number;
}

export class RevenueByMonthDto {
  month: string;
  revenue: number;
}

export class DetailedStatsDto {
  ordersByStatus: OrdersByStatusDto[];
  revenueByMonth: RevenueByMonthDto[];
}
