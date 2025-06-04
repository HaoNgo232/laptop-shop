import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserProfileDto } from '@/auth/dtos/update-profile.dto';
import { UserProfileDto } from '@/auth/dtos/user-profile.dto';
import { UsersService } from '@/auth/services/users.service';
import { Body, Controller, Get, Put } from '@nestjs/common';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
