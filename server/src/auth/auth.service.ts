import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { CreateUserProvider } from './providers/create-user.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { ValidateUserProvider } from './providers/validate-user.provider';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ChangePasswordProvider } from './providers/change-password.provider';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokenProvider } from './providers/refresh-token.provider';

@Injectable()
export class AuthService {
  /**
   * Khởi tạo AuthService với các provider cần thiết.
   * @param createUserProvider Provider để tạo người dùng mới.
   * @param generateTokensProvider Provider để tạo access token và refresh token.
   * @param validateUserProvider Provider để xác thực thông tin đăng nhập của người dùng.
   * @param changePasswordProvider Provider để thay đổi mật khẩu người dùng.
   * @param forgotPasswordProvider Provider để xử lý yêu cầu quên mật khẩu.
   * @param resetPasswordProvider Provider để đặt lại mật khẩu người dùng.
   * @param refreshTokenProvider Provider để làm mới access token.
   */
  constructor(
    private readonly createUserProvider: CreateUserProvider,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly validateUserProvider: ValidateUserProvider,

    private readonly changePasswordProvider: ChangePasswordProvider,

    private readonly forgotPasswordProvider: ForgotPasswordProvider,

    private readonly resetPasswordProvider: ResetPasswordProvider,

    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  /**
   * Đăng ký người dùng mới.
   * @param registerDto Thông tin đăng ký của người dùng.
   * @returns Thông tin người dùng đã được tạo (không bao gồm mật khẩu).
   */
  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    return this.createUserProvider.createUser(registerDto);
  }

  /**
   * Đăng nhập người dùng.
   * @param loginDto Thông tin đăng nhập của người dùng.
   * @returns Access token, refresh token và thông tin người dùng (không bao gồm mật khẩu).
   */
  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'password'>;
  }> {
    const user = await this.validateUserProvider.verifyUser(
      loginDto.email,
      loginDto.password,
    );
    const tokens = await this.generateTokensProvider.generateTokens(user);
    return { ...tokens, user };
  }

  /**
   * Thay đổi mật khẩu người dùng.
   * @param userId ID của người dùng.
   * @param changePasswordDto Thông tin mật khẩu mới.
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.changePasswordProvider.changePassword(
      userId,
      changePasswordDto,
    );
  }

  /**
   * Xử lý yêu cầu quên mật khẩu.
   * Gửi email đặt lại mật khẩu cho người dùng.
   * @param email Email của người dùng.
   */
  async forgotPassword(email: string): Promise<void> {
    return this.forgotPasswordProvider.sendResetPasswordEmail(email);
  }

  /**
   * Đặt lại mật khẩu người dùng.
   * @param resetPasswordDto Thông tin để đặt lại mật khẩu (bao gồm token và mật khẩu mới).
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    return this.resetPasswordProvider.resetPassword(resetPasswordDto);
  }

  /**
   * Làm mới access token bằng refresh token.
   * @param refreshTokenDto Refresh token của người dùng.
   * @returns Access token và refresh token mới.
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }
}
