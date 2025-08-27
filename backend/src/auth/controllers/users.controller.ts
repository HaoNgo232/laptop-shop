import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserProfileDto } from '@/auth/dtos/update-profile.dto';
import { User } from '@/auth/entities/user.entity';
import { UsersService } from '@/auth/services/users.service';
import { RankService } from '@/orders/services/rank.service';
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiExtraModels } from '@nestjs/swagger';

@ApiTags('👤 User Management')
@ApiExtraModels(UpdateUserProfileDto, User)
@ApiBearerAuth('Authorization')
@Controller('api/users')
export class UsersController {
  constructor(
    /**
     * Service để xử lý logic liên quan đến người dùng.
     */
    private readonly usersService: UsersService,
    private readonly rankService: RankService,
  ) {}

  /**
   * Lấy thông tin người dùng.
   */
  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  @ApiOkResponse({ description: 'Trả về hồ sơ người dùng hiện tại.' })
  async getUserProfile(@CurrentUser('sub') userId: string): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.findById(userId);
  }

  /**
   * Cập nhật thông tin người dùng.
   */
  @Put('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  @ApiOkResponse({ description: 'Cập nhật hồ sơ thành công.' })
  async updateUserProfile(
    @CurrentUser('sub') userId: string,
    @Body()
    updateUserDto: UpdateUserProfileDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.update(userId, updateUserDto);
  }

  /**
   * Admin endpoint - Cập nhật lại rank cho toàn bộ người dùng (phục vụ mục đích test/dev)
   */
  @Post('admin/update-all-ranks')
  @ApiOperation({ summary: 'Force cập nhật rank tất cả users (DEV)' })
  @ApiOkResponse({ description: 'Đã cập nhật rank cho tất cả users.' })
  async forceUpdateAllRanks() {
    await this.rankService.forceUpdateRanks();
    return { message: 'Đã cập nhật rank cho tất cả users' };
  }
}
