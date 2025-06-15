import { AdminUserViewDto } from '@/admin/dtos/admin-user-view.dto';
import { AdminUserQueryDto } from '@/admin/dtos/admin-user-query.dto';
import { AdminUsersService } from '@/admin/services/admin-users.service';
import { Body, Controller, Get, Inject, Param, Put, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminViewDetailDto } from '@/admin/dtos/admin-view-detail.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { UpdateUserByAdminDto } from '@/admin/dtos/update-user-by-admin.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';

@ApiTags('Admin Users')
@ApiBearerAuth()
@Controller('api/admin/users')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminUsersController {
  constructor(
    @Inject(AdminUsersService)
    private readonly adminUsersService: AdminUsersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách người dùng',
    description:
      'Lấy danh sách tất cả người dùng với phân trang và tìm kiếm. Hỗ trợ lọc theo vai trò và tìm kiếm theo email/tên người dùng',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng item trên mỗi trang (mặc định: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Tìm kiếm theo email hoặc tên người dùng',
    example: 'john@example.com',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Lọc theo vai trò người dùng',
    enum: UserRole,
    example: UserRole.USER,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng thành công',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/AdminUserViewDto' },
        },
        meta: {
          type: 'object',
          properties: {
            currentPage: { type: 'number' },
            itemsPerPage: { type: 'number' },
            totalItems: { type: 'number' },
            totalPages: { type: 'number' },
            hasPreviousPage: { type: 'boolean' },
            hasNextPage: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: 403,
    description: 'Không phải admin',
  })
  async getUsers(@Query() query: AdminUserQueryDto): Promise<PaginatedResponse<AdminUserViewDto>> {
    return this.adminUsersService.findAllForAdmin(query);
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết người dùng',
    description:
      'Lấy thông tin chi tiết của một người dùng cụ thể bao gồm địa chỉ và số điện thoại',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID của người dùng',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng thành công',
    type: AdminViewDetailDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: 403,
    description: 'Không phải admin',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  async getUserById(@Param('userId') userId: string): Promise<AdminViewDetailDto> {
    return this.adminUsersService.findByIdForAdmin(userId);
  }

  @Put(':userId')
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description:
      'Cập nhật vai trò và trạng thái hoạt động của người dùng. Chỉ admin mới có thể thực hiện',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID của người dùng cần cập nhật',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thông tin người dùng thành công',
    type: AdminViewDetailDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập',
  })
  @ApiResponse({
    status: 403,
    description: 'Không phải admin',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserByAdminDto,
  ): Promise<AdminViewDetailDto> {
    return this.adminUsersService.updateByAdmin(userId, updateUserDto);
  }
}
