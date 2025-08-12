import { AdminUserViewDto } from '@/admin/dtos/admin-user-view.dto';
import { AdminUserQueryDto } from '@/admin/dtos/admin-user-query.dto';
import { ManagerUsersService } from '@/admin/services/manager-users.service';
import { Body, Controller, Get, Inject, Param, Put, Query } from '@nestjs/common';

import { AdminViewDetailDto } from '@/admin/dtos/admin-view-detail.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UpdateUserByAdminDto } from '@/admin/dtos/update-user-by-admin.dto';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';
import { UserRole } from '@/auth/enums/user-role.enum';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin - Người dùng')
@ApiBearerAuth('Authorization')
@Controller('api/admin/manager-users')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class ManagerUsersController {
  constructor(
    @Inject(ManagerUsersService)
    private readonly managerUsersService: ManagerUsersService,
  ) {}
  /**
   * Lấy danh sách người dùng với phân trang và lọc
   */
  @Get()
  @ApiOperation({ summary: 'Danh sách người dùng (admin)' })
  @ApiOkResponse({ description: 'Danh sách người dùng theo bộ lọc/phân trang.' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'q', required: false, description: 'Từ khóa (email/username)' })
  async getUsers(@Query() query: AdminUserQueryDto): Promise<PaginatedResponse<AdminUserViewDto>> {
    return this.managerUsersService.findAll(query);
  }
  /**
   * Lấy thông tin chi tiết người dùng theo ID
   */
  @Get(':userId')
  @ApiOperation({ summary: 'Chi tiết người dùng (admin)' })
  @ApiOkResponse({ description: 'Thông tin chi tiết người dùng.' })
  @ApiParam({ name: 'userId', description: 'ID người dùng' })
  async getUserById(@Param('userId') userId: string): Promise<AdminViewDetailDto> {
    return this.managerUsersService.findOne(userId);
  }

  /**
   * Cập nhật thông tin người dùng theo ID
   */
  @Put(':userId')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng (admin)' })
  @ApiOkResponse({ description: 'Cập nhật người dùng thành công.' })
  @ApiParam({ name: 'userId', description: 'ID người dùng' })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserByAdminDto,
  ): Promise<AdminViewDetailDto> {
    return this.managerUsersService.update(userId, updateUserDto);
  }
}
