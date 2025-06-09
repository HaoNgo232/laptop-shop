import { IDashboardSummary } from '@web-ecom/shared-types/admin/interfaces.cjs';

export class DashboardSummaryDto implements IDashboardSummary {
  newUsersCount: number;
  newOrdersCount: number;
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
}
