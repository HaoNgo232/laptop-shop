import { Controller, Get, Inject } from '@nestjs/common';
import { AdminDashboardService } from '@/admin/services/admin-dashboard.service';
import { DashboardSummaryDto } from '@/admin/dtos/dashboard-summary.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { DetailedStatsDto } from '@/admin/dtos/detailed-stats.dto';

@Controller('api/admin/dashboard')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminDashboardController {
  constructor(
    @Inject(AdminDashboardService)
    private readonly adminDashboardService: AdminDashboardService,
  ) {}

  // Lấy tổng quan dashboard với các metrics cơ bản
  @Get('summary')
  async getSummary(): Promise<DashboardSummaryDto> {
    return await this.adminDashboardService.getSummary();
  }

  // Lấy thống kê chi tiết với biểu đồ và phân tích sâu
  @Get('detailed-stats')
  async getDetailedStats(): Promise<DetailedStatsDto> {
    return await this.adminDashboardService.getStats();
  }
}
