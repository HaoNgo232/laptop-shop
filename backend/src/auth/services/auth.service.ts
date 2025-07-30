import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GenerateTokensProvider } from '@/auth/providers/generate-tokens.provider';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { LoginUserDto } from '@/auth/dtos/login.dto';
import { User } from '@/auth/entities/user.entity';
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
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly generateTokensProvider: GenerateTokensProvider,
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
      await this.isEmailExists(registerUserDto.email);

      // Mã hóa mật khẩu
      const hashedPassword = await this.hashPassword(registerUserDto.password);

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
    const user = await this.findByEmail(loginUserDto.email);

    // Kiểm tra mật khẩu
    await this.verifyPassword(loginUserDto.password, user);

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
      const user = await this.findByPayload(payload.sub);

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

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await this.bcryptProvider.hashPassword(password);

    if (!hashedPassword) {
      throw new InternalServerErrorException('Mã hóa mật khẩu thất bại');
    }

    return hashedPassword;
  }

  private async sendWelcomeEmail(user: User): Promise<void> {
    try {
      await this.mailService.sendWelcome(user);
    } catch (error) {
      throw new RequestTimeoutException(error, 'Gửi email chào mừng thất bại');
    }
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    return user;
  }

  /**
   * Tìm user theo ID trong payload
   */
  private async findByPayload(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Không tìm thấy user');
    }

    return user;
  }

  private async verifyPassword(password: string, user: User): Promise<void> {
    const isPasswordValid = await this.bcryptProvider.comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }
  }

  /**
   * Kiểm tra email đã tồn tại chưa
   */
  private async isEmailExists(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new ConflictException('Email đã tồn tại');
    }
  }
}
