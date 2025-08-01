import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserProfileDto } from '@/auth/dtos/update-profile.dto';
import { User } from '@/auth/entities/user.entity';
import { UsersService } from '@/auth/services/users.service';
import { RankService } from '@/orders/services/rank.service';
import { Body, Controller, Get, Patch, Post, Put } from '@nestjs/common';

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
  async getUserProfile(@CurrentUser('sub') userId: string): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.findById(userId);
  }

  /**
   * Cập nhật thông tin người dùng.
   */
  @Patch('profile')
  async updateUserProfile(
    @CurrentUser('sub') userId: string,
    @Body()
    updateUserDto: UpdateUserProfileDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.update(userId, updateUserDto);
  }

  /**
   * Admin endpoint - force update tất cả user ranks (để test)
   */
  @Post('admin/update-all-ranks')
  async forceUpdateAllRanks() {
    await this.rankService.forceUpdateRanks();
    return { message: 'Đã cập nhật rank cho tất cả users' };
  }
}
