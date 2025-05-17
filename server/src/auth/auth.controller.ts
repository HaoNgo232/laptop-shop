import { Controller, Post, Body, Patch, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { IsPublic } from './decorators/isPublic.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { UserProfileDto } from './dtos/user-profile.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserProfileDto> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @IsPublic()
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout() {
    return { message: 'Đăng xuất thành công' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User | null) {
    return user;
  }

  @Post('refresh-token')
  @IsPublic()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userId, changePasswordDto);
    return { message: 'Mật khẩu đã được thay đổi thành công' };
  }

  @Post('forgot-password')
  @IsPublic()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: 'Email khôi phục mật khẩu đã được gửi' };
  }

  @Post('reset-password')
  @IsPublic()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Mật khẩu đã được đặt lại thành công' };
  }
}
