import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { ResetPasswordDto } from '@/auth/dtos/reset-password.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { Injectable } from '@nestjs/common';
import { GenerateTokensProvider } from '@/auth/providers/generate-tokens.provider';
import { TokenBlacklistProvider } from '@/auth/providers/token-blacklist.provider';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { LoginUserDto } from '@/auth/dtos/login.dto';
import { User } from '@/auth/entities/user.entity';
import { CreateUserUseCase } from '@/auth/use-cases/create-user.use-case';
import { ValidateUserUseCase } from '@/auth/use-cases/validate-user.use-case';
import { ForgotPasswordUseCase } from '@/auth/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '@/auth/use-cases/reset-password.use-case';
import { RefreshTokenUseCase } from '@/auth/use-cases/refresh-token.use-case';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ChangePasswordUseCase } from '../use-cases/change-password.use-case';

interface IAuthService {
  register(registerUserDto: RegisterUserDto): Promise<User>;
  login(loginUserDto: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'passwordHash'>;
  }>;
  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto>;
  validateUser(email: string, password: string): Promise<User | null>;
  generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>;
  changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }>;
  logout(accessToken: string, refreshToken?: string): Promise<void>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly tokenBlacklistProvider: TokenBlacklistProvider,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  /**
   * Đăng ký người dùng mới.
   * @param RegisterUserDto Thông tin đăng ký của người dùng.
   * @returns Thông tin người dùng đã được tạo (không bao gồm mật khẩu).
   */
  async register(registerUserDto: RegisterUserDto) {
    return this.createUserUseCase.execute(registerUserDto);
  }

  /**
   * Đăng nhập người dùng.
   * @param LoginUserDto Thông tin đăng nhập của người dùng.
   * @returns Access token, refresh token và thông tin người dùng (không bao gồm mật khẩu).
   */
  async login(loginUserDto: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'passwordHash'>;
  }> {
    const user = await this.validateUserUseCase.execute(loginUserDto.email, loginUserDto.password);

    const tokens = await this.generateTokensProvider.generateTokens(user);
    return { ...tokens, user: user as Omit<User, 'passwordHash'> };
  }

  /**
   * Làm mới access token bằng refresh token.
   * @param refreshTokenDto Refresh token của người dùng.
   * @returns Access token và refresh token mới.
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.refreshTokenUseCase.execute(refreshTokenDto);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.validateUserUseCase.execute(email, password);
    return user;
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.generateTokensProvider.generateTokens(user);
    return tokens;
  }

  async forgotPassword(email: string): Promise<void> {
    return this.forgotPasswordUseCase.execute(email);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    return this.resetPasswordUseCase.execute(resetPasswordDto);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.changePasswordUseCase.execute(userId, changePasswordDto);
  }

  /**
   * Đăng xuất người dùng và đưa token vào blacklist.
   * @param accessToken Access token cần đưa vào blacklist
   * @param refreshToken Refresh token cần đưa vào blacklist
   */
  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    const formattedAccessToken = accessToken.replace('Bearer ', '');

    await this.tokenBlacklistProvider.addToBlacklist(formattedAccessToken, 'access');

    if (refreshToken) {
      await this.tokenBlacklistProvider.addToBlacklist(refreshToken, 'refresh');
    }
  }
}
