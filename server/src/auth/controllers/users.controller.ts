import { UserProfileDto } from './../dtos/user-profile.dto';
import { CurrentUser } from './../decorators/current-user.decorator';
import { UpdateUserProfileDto } from './../dtos/update-profile.dto';
import { UsersService } from './../services/users.service';
import { Body, Controller, Get, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Người dùng')
@ApiBearerAuth()
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Lấy thông tin hồ sơ người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin hồ sơ người dùng',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @Get('profile')
  async getUserProfile(
    @CurrentUser('id') userId: string,
  ): Promise<UserProfileDto> {
    return this.usersService.findById(userId);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin hồ sơ đã được cập nhật',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @Put('profile')
  async updateUserProfile(
    @CurrentUser('id') userId: string,
    @Body()
    updateUserDto: UpdateUserProfileDto,
  ): Promise<UserProfileDto> {
    return this.usersService.update(userId, updateUserDto);
  }
}
