import { Auth } from '@/auth/decorators/auth.decorator';
import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { LoginUserDto } from '@/auth/dtos/login.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { User } from '@/auth/entities/user.entity';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { AuthService } from '@/auth/services/auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Xác thực')
@Controller('api/auth')
export class AuthController {
  constructor(
    /**
     * Service để xử lý logic liên quan đến xác thực.
     */
    private readonly authService: AuthService,
  ) {}

  /**
   * Đăng ký người dùng mới.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Đăng ký', description: 'Tạo tài khoản người dùng mới.' })
  @ApiCreatedResponse({ description: 'Tạo tài khoản thành công.' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc email/username đã tồn tại.' })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<Omit<User, 'passwordHash'>> {
    return this.authService.register(registerUserDto);
  }

  /**
   * Đăng nhập người dùng.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Xác thực và trả về access token + refresh token.',
  })
  @ApiOkResponse({ description: 'Đăng nhập thành công. Trả về token và thông tin người dùng.' })
  @ApiUnauthorizedResponse({ description: 'Sai thông tin đăng nhập.' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    return this.authService.login(loginUserDto);
  }

  /**
   * Làm mới access token bằng refresh token.
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Làm mới token',
    description: 'Cấp lại access token từ refresh token hợp lệ.',
  })
  @ApiOkResponse({ description: 'Làm mới token thành công.' })
  @ApiUnauthorizedResponse({ description: 'Refresh token không hợp lệ hoặc đã hết hạn.' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
