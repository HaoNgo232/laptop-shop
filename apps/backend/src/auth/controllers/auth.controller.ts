import { Auth } from '@/auth/decorators/auth.decorator';
import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { LoginUserDto } from '@/auth/dtos/login.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { User } from '@/auth/entities/user.entity';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { AuthService } from '@/auth/services/auth.service';
import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Auth(AuthType.None)
  async register(@Body() registerUserDto: RegisterUserDto): Promise<Omit<User, 'passwordHash'>> {
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
  @Auth(AuthType.None)
  async logout(
    @Headers('authorization') authHeader: string,
    @Body() refreshTokenDto?: RefreshTokenDto,
  ) {
    await this.authService.logout(authHeader, refreshTokenDto?.refreshToken);
    return { message: 'Đăng xuất thành công' };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
