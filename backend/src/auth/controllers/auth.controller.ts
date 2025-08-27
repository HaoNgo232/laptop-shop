import { Auth } from '@/auth/decorators/auth.decorator';
import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { LoginUserDto } from '@/auth/dtos/login.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { UserResponseDto } from '@/auth/dtos/user-response.dto';
import { User } from '@/auth/entities/user.entity';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { AuthService } from '@/auth/services/auth.service';
import { ValidationErrorResponseDto, UnauthorizedErrorResponseDto, ErrorResponseDto } from '@/common/dtos/api-response.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiConflictResponse,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('🔐 Authentication')
@ApiExtraModels(LoginResponseDto, UserResponseDto, RegisterUserDto, LoginUserDto, RefreshTokenDto, ValidationErrorResponseDto, UnauthorizedErrorResponseDto, ErrorResponseDto)
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
  @ApiOperation({ 
    summary: 'Đăng ký tài khoản mới',
    description: `
      Tạo tài khoản người dùng mới trong hệ thống.
      
      **Yêu cầu:**
      - Email chưa được sử dụng
      - Username chưa được sử dụng
      - Mật khẩu ít nhất 8 ký tự, có chữ và số
      - Xác nhận mật khẩu phải khớp
      
      **Thành công:** Trả về thông tin người dùng (không bao gồm mật khẩu)
    `
  })
  @ApiCreatedResponse({ 
    description: 'Tạo tài khoản thành công. Trả về thông tin người dùng.',
    type: UserResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Dữ liệu không hợp lệ - thiếu thông tin bắt buộc hoặc định dạng sai.',
    type: ValidationErrorResponseDto
  })
  @ApiConflictResponse({ 
    description: 'Email hoặc username đã tồn tại trong hệ thống.',
    type: ErrorResponseDto
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi tạo tài khoản.',
    type: ErrorResponseDto
  })
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
    summary: 'Đăng nhập vào hệ thống',
    description: `
      Xác thực người dùng và cấp phát token truy cập.
      
      **Cách sử dụng:**
      1. Gửi email và mật khẩu
      2. Nhận access token (có thời hạn 1 giờ)
      3. Nhận refresh token (có thời hạn 7 ngày)
      4. Sử dụng access token trong header: Authorization: Bearer <token>
      
      **Lưu ý:** Access token cần được làm mới bằng refresh token khi hết hạn.
    `,
  })
  @ApiOkResponse({ 
    description: 'Đăng nhập thành công. Trả về access token, refresh token và thông tin người dùng.',
    type: LoginResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Thiếu email hoặc mật khẩu, hoặc định dạng email không hợp lệ.',
    type: ValidationErrorResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Email hoặc mật khẩu không chính xác.',
    type: UnauthorizedErrorResponseDto
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server trong quá trình xác thực.',
    type: ErrorResponseDto
  })
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
    summary: 'Làm mới access token',
    description: `
      Cấp lại access token mới từ refresh token hợp lệ.
      
      **Khi nào sử dụng:**
      - Access token đã hết hạn (401 Unauthorized)
      - Muốn gia hạn phiên đăng nhập
      
      **Lưu ý:** 
      - Refresh token có thời hạn 7 ngày
      - Sau khi hết hạn refresh token, cần đăng nhập lại
    `,
  })
  @ApiOkResponse({ 
    description: 'Làm mới token thành công. Trả về access token và refresh token mới.',
    type: LoginResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Thiếu refresh token hoặc định dạng không hợp lệ.',
    type: ValidationErrorResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Refresh token không hợp lệ, đã hết hạn hoặc đã bị thu hồi.',
    type: UnauthorizedErrorResponseDto
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi làm mới token.',
    type: ErrorResponseDto
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
