import { Controller, Get, Inject } from '@nestjs/common';
import { AdminDashboardService } from '@/admin/services/admin-dashboard.service';
import { DashboardSummaryDto } from '@/admin/dtos/dashboard-summary.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { DetailedStatsDto } from '@/admin/dtos/detailed-stats.dto';
import { UserRole } from '@/auth/enums/user-role.enum';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth('Authorization')
@Controller('api/admin/dashboard')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminDashboardController {
  constructor(
    @Inject(AdminDashboardService)
    private readonly adminDashboardService: AdminDashboardService,
  ) {}

  /**
   *  Lấy tổng quan dashboard với các metrics cơ bản
   */
  @Get('summary')
  @ApiOperation({ summary: 'Tổng quan hệ thống' })
  @ApiOkResponse({ description: 'Trả về số liệu tổng quan cho dashboard.' })
  async getSummary(): Promise<DashboardSummaryDto> {
    return await this.adminDashboardService.getSummary();
  }

  /**
   *  Lấy thống kê chi tiết với biểu đồ và phân tích sâu
   */
  @Get('detailed-stats')
  @ApiOperation({ summary: 'Thống kê chi tiết' })
  @ApiOkResponse({ description: 'Trả về thống kê chi tiết (biểu đồ/breakdown).' })
  async getDetailedStats(): Promise<DetailedStatsDto> {
    return await this.adminDashboardService.getStats();
  }
}
