import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { GenerateTokensProvider } from '@/auth/providers/generate-tokens.provider';
import { TokenBlacklistProvider } from '@/auth/providers/token-blacklist.provider';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { LoginUserDto } from '@/auth/dtos/login.dto';
import { User } from '@/auth/entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  RequestTimeoutException,
} from '@nestjs/common';
import { MailService } from '@/mail/mail.service';
import { BcryptProvider } from '@/auth/providers/bcrypt.provider';
import { Repository } from 'typeorm';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '@/auth/config/jwt.config';
import { JwtService } from '@nestjs/jwt';

interface IAuthService {
  register(registerUserDto: RegisterUserDto): Promise<User>;
  login(loginUserDto: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'passwordHash'>;
  }>;
  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto>;
  logout(accessToken: string, refreshToken?: string): Promise<void>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly tokenBlacklistProvider: TokenBlacklistProvider,
    private readonly bcryptProvider: BcryptProvider,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Đăng ký người dùng mới.
   */
  async register(registerUserDto: RegisterUserDto) {
    try {
      // Kiểm tra email đã tồn tại chưa
      await this.checkEmail(registerUserDto.email);
      // Mã hóa mật khẩu
      const hashedPassword = await this.hashUserPassword(registerUserDto.password);

      // Tạo user mới
      const newUser = await this.createNewUser(registerUserDto, hashedPassword);

      // Gửi email chào mừng
      await this.sendWelcomeEmail(newUser);

      return newUser;
    } catch (error) {
      throw new BadRequestException(error, 'Đăng ký tài khoản thất bại');
    }
  }

  /**
   * Đăng nhập người dùng.
   */
  async login(loginUserDto: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'passwordHash'>;
  }> {
    // Kiểm tra thông tin đăng nhập
    const user = await this.getUserByEmail(loginUserDto.email);

    // Kiểm tra mật khẩu
    await this.checkPassword(loginUserDto.password, user);

    // Tạo token
    const tokens = await this.generateTokensProvider.generateTokens(user);

    // Trả về thông tin user và tokens
    return { ...tokens, user: user as Omit<User, 'passwordHash'> };
  }

  /**
   * Làm mới access token bằng refresh token.
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    try {
      // Xác thực refresh token và lấy payload
      const payload = await this.verifyRefreshToken(refreshTokenDto.refreshToken);

      // Lấy thông tin user từ database
      const user = await this.getUserFromPayload(payload.sub);

      // Tạo token mới
      const tokens = await this.generateTokensProvider.generateTokens(user);

      return { ...tokens, user };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  /**
   * Đăng xuất người dùng và đưa token vào blacklist.
   */
  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    // Lấy access token
    const formattedAccessToken = accessToken.replace('Bearer ', '');

    // Thêm access token vào blacklist
    await this.tokenBlacklistProvider.addToBlacklist(formattedAccessToken, 'access');

    // Thêm refresh token vào blacklist nếu có
    if (refreshToken) {
      await this.tokenBlacklistProvider.addToBlacklist(refreshToken, 'refresh');
    }
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
      secret: this.jwtConfiguration.secret,
    });
  }

  private async createNewUser(
    registerUserDto: RegisterUserDto,
    hashedPassword: string,
  ): Promise<User> {
    const newUser: User = this.userRepository.create({
      ...registerUserDto,
      passwordHash: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  private async hashUserPassword(password: string): Promise<string> {
    const hashedPassword = await this.bcryptProvider.hashPassword(password);

    if (!hashedPassword) {
      throw new InternalServerErrorException('Mã hóa mật khẩu thất bại');
    }

    return hashedPassword;
  }

  private async sendWelcomeEmail(user: User): Promise<void> {
    try {
      await this.mailService.sendUserWelcomeEmail(user);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    return user;
  }

  private async getUserFromPayload(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Không tìm thấy user');
    }

    return user;
  }

  private async checkPassword(password: string, user: User): Promise<void> {
    const isPasswordValid = await this.bcryptProvider.comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }
  }

  private async checkEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new ConflictException('Email đã tồn tại');
    }
  }
}
