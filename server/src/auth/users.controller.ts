import { Body, Controller, Get, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getUserProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Put('profile')
  async updateUserProfile(
    @CurrentUser('id') userId: string,
    @Body()
    updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateUserProfile(userId, updateProfileDto);
  }
}
