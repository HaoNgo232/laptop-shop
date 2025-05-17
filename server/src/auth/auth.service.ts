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
  constructor(
    private readonly createUserProvider: CreateUserProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly validateUserProvider: ValidateUserProvider,
    private readonly changePasswordProvider: ChangePasswordProvider,
    private readonly forgotPasswordProvider: ForgotPasswordProvider,
    private readonly resetPasswordProvider: ResetPasswordProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    return this.createUserProvider.createUser(registerDto);
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUserProvider.verifyUser(
      loginDto.email,
      loginDto.password,
    );
    return this.generateTokensProvider.generateTokens(user);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.changePasswordProvider.changePassword(
      userId,
      changePasswordDto,
    );
  }

  async forgotPassword(email: string): Promise<void> {
    return this.forgotPasswordProvider.sendResetPasswordEmail(email);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    return this.resetPasswordProvider.resetPassword(resetPasswordDto);
  }

  async refreshToken(refreshToken: string) {
    const refreshTokenDto: RefreshTokenDto = { refreshToken };
    return this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }
}
