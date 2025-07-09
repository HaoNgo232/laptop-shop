import { AdminUserViewDto } from '@/admin/dtos/admin-user-view.dto';
import { AdminUserQueryDto } from '@/admin/dtos/admin-user-query.dto';
import { ManagerUsersService } from '@/admin/services/manager-users.service';
import { Body, Controller, Get, Inject, Param, Put, Query } from '@nestjs/common';

import { AdminViewDetailDto } from '@/admin/dtos/admin-view-detail.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { UpdateUserByAdminDto } from '@/admin/dtos/update-user-by-admin.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';

@Controller('api/admin/manager-users')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class ManagerUsersController {
  constructor(
    @Inject(ManagerUsersService)
    private readonly managerUsersService: ManagerUsersService,
  ) {}

  @Get()
  async getUsers(@Query() query: AdminUserQueryDto): Promise<PaginatedResponse<AdminUserViewDto>> {
    return this.managerUsersService.findAll(query);
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string): Promise<AdminViewDetailDto> {
    return this.managerUsersService.findOne(userId);
  }

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserByAdminDto,
  ): Promise<AdminViewDetailDto> {
    return this.managerUsersService.update(userId, updateUserDto);
  }
}
