import { Auth } from '@/auth/decorators/auth.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { ForgotPasswordDto } from '@/auth/dtos/forgot-password.dto';
import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { LoginUserDto } from '@/auth/dtos/login.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { ResetPasswordDto } from '@/auth/dtos/reset-password.dto';
import { UserProfileDto } from '@/auth/dtos/user-profile.dto';
import { User } from '@/auth/entities/user.entity';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { AuthService } from '@/auth/services/auth.service';
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Auth(AuthType.None)
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserProfileDto> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Headers('authorization') authHeader: string,
    @Body() refreshTokenDto?: RefreshTokenDto,
  ) {
    await this.authService.logout(authHeader, refreshTokenDto?.refreshToken);
    return { message: 'Đăng xuất thành công' };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getProfile(@CurrentUser() user: Omit<User, 'password'>): Omit<User, 'password'> {
    return user;
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: 'Email khôi phục mật khẩu đã được gửi' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Mật khẩu đã được đặt lại thành công' };
  }
}
