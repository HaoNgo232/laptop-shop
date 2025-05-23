import { UserProfileDto } from './../dtos/user-profile.dto';
import { CurrentUser } from './../decorators/current-user.decorator';
import { UpdateUserProfileDto } from './../dtos/update-profile.dto';
import { UsersService } from './../services/users.service';
import { Body, Controller, Get, Put } from '@nestjs/common';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getUserProfile(
    @CurrentUser('id') userId: string,
  ): Promise<UserProfileDto> {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  async updateUserProfile(
    @CurrentUser('id') userId: string,
    @Body()
    updateUserDto: UpdateUserProfileDto,
  ): Promise<UserProfileDto> {
    return this.usersService.update(userId, updateUserDto);
  }
}
