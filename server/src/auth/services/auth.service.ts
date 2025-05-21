import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from '../providers/create-user.provider';
import { GenerateTokensProvider } from '../providers/generate-tokens.provider';
import { ValidateUserProvider } from '../providers/validate-user.provider';
import { ForgotPasswordProvider } from '../providers/forgot-password.provider';
import { ResetPasswordProvider } from '../providers/reset-password.provider';
import { RefreshTokenProvider } from '../providers/refresh-token.provider';
import { TokenBlacklistProvider } from '../providers/token-blacklist.provider';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login.dto';
import { User } from '../entities/user.entity';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly validateUserProvider: ValidateUserProvider,

    private readonly forgotPasswordProvider: ForgotPasswordProvider,

    private readonly resetPasswordProvider: ResetPasswordProvider,

    private readonly refreshTokenProvider: RefreshTokenProvider,

    private readonly tokenBlacklistProvider: TokenBlacklistProvider,
  ) {}

  /**
   * Đăng ký người dùng mới.
   * @param RegisterUserDto Thông tin đăng ký của người dùng.
   * @returns Thông tin người dùng đã được tạo (không bao gồm mật khẩu).
   */
  async register(registerUserDto: RegisterUserDto) {
    return this.createUserProvider.createUser(registerUserDto);
  }

  /**
   * Đăng nhập người dùng.
   * @param LoginUserDto Thông tin đăng nhập của người dùng.
   * @returns Access token, refresh token và thông tin người dùng (không bao gồm mật khẩu).
   */
  async login(loginUserDto: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
  }> {
    const user = await this.validateUserProvider.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    const tokens = await this.generateTokensProvider.generateTokens(user);
    return { ...tokens, user };
  }

  /**
   * Làm mới access token bằng refresh token.
   * @param refreshTokenDto Refresh token của người dùng.
   * @returns Access token và refresh token mới.
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
    return this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.validateUserProvider.validateUser(email, password);
    return user;
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.generateTokensProvider.generateTokens(user);
    return tokens;
  }

  async forgotPassword(email: string): Promise<void> {
    return this.forgotPasswordProvider.sendResetPasswordEmail(email);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    return this.resetPasswordProvider.resetPassword(resetPasswordDto);
  }

  /**
   * Đăng xuất người dùng và đưa token vào blacklist.
   * @param accessToken Access token cần đưa vào blacklist
   * @param refreshToken Refresh token cần đưa vào blacklist
   */
  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    // Bỏ "Bearer " từ đầu nếu tồn tại
    const formattedAccessToken = accessToken.replace('Bearer ', '');

    // Thêm access token vào blacklist
    await this.tokenBlacklistProvider.addToBlacklist(
      formattedAccessToken,
      'access',
    );

    // Nếu có refresh token, thêm cả refresh token vào blacklist
    if (refreshToken) {
      await this.tokenBlacklistProvider.addToBlacklist(refreshToken, 'refresh');
    }
  }
}
