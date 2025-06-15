import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserProfileDto } from '@/auth/dtos/update-profile.dto';
import { UserProfileDto } from '@/auth/dtos/user-profile.dto';
import { UsersService } from '@/auth/services/users.service';
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { AuthService } from '../services/auth.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('profile')
  async getUserProfile(@CurrentUser('sub') userId: string): Promise<UserProfileDto> {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  async updateUserProfile(
    @CurrentUser('sub') userId: string,
    @Body()
    updateUserDto: UpdateUserProfileDto,
  ): Promise<UserProfileDto> {
    return this.usersService.update(userId, updateUserDto);
  }

  @Put('change-password')
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(userId, changePasswordDto);
  }
}
