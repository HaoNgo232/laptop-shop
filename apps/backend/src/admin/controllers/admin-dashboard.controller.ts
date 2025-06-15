import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminDashboardService } from '@/admin/services/admin-dashboard.service';
import { DashboardSummaryDto } from '@/admin/dtos/dashboard-summary.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { DetailedStatsDto } from '@/admin/dtos/detailed-stats.dto';

@ApiTags('Admin Dashboard')
@ApiBearerAuth()
@Controller('api/admin/dashboard')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminDashboardController {
  constructor(
    @Inject(AdminDashboardService)
    private readonly adminDashboardService: AdminDashboardService,
  ) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Lấy thống kê tổng quan dashboard',
    description:
      'Trả về các thống kê tổng quan cho dashboard admin bao gồm số lượng người dùng mới, đơn hàng mới, tổng doanh thu và các metrics khác',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê tổng quan thành công',
    type: DashboardSummaryDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: 403,
    description: 'Không phải admin',
  })
  async getSummary(): Promise<DashboardSummaryDto> {
    return await this.adminDashboardService.getDashboardSummary();
  }

  @Get('detailed-stats')
  @ApiOperation({
    summary: 'Lấy thống kê chi tiết',
    description:
      'Trả về thống kê chi tiết bao gồm đơn hàng theo trạng thái và doanh thu theo tháng',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê chi tiết thành công',
    type: DetailedStatsDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: 403,
    description: 'Không phải admin',
  })
  async getDetailedStats(): Promise<DetailedStatsDto> {
    return await this.adminDashboardService.getDetailedStats();
  }
}
