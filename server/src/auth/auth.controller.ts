import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    /**
     * Inject AuthService
     */
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  // @Post('login')
  // async login(@Body() loginDto: LoginDto) {
  //   return this.authService.login(loginDto);
  // }

  @Post('logout')
  logout() {
    return { message: 'Đăng xuất thành công' };
  }

  // @Post('refresh-token')
  // async refreshToken(@Body() body: { refreshToken: string }) {
  //   return this.authService.refreshToken(body.refreshToken);
  // }

  // @Get('me')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  // @Patch('change-password')
  // async changePassword(
  //   @Request() req,
  //   @Body() changePasswordDto: ChangePasswordDto,
  // ) {
  //   await this.authService.changePassword(req.user.id, changePasswordDto);
  //   return { message: 'Mật khẩu đã được thay đổi thành công' };
  // }

  // @Post('forgot-password')
  // async forgotPassword(@Body() body: { email: string }) {
  //   await this.authService.forgotPassword(body.email);
  //   return { message: 'Email khôi phục mật khẩu đã được gửi' };
  // }

  // @Post('reset-password')
  // async resetPassword(@Body() body: { token: string; newPassword: string }) {
  //   await this.authService.resetPassword(body.token, body.newPassword);
  //   return { message: 'Mật khẩu đã được đặt lại thành công' };
  // }
}
