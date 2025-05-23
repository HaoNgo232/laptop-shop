import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserProfileDto } from '../dtos/user-profile.dto';
import { AuthType } from '../enums/auth-type.enum';
import { Auth } from '../decorators/auth.decorator';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginUserDto } from '../dtos/login.dto';
import { User } from '../entities/user.entity';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Auth(AuthType.None)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserProfileDto> {
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
  getProfile(
    @CurrentUser() user: Omit<User, 'password'>,
  ): Omit<User, 'password'> {
    return user;
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
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
