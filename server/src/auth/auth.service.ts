/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserProvider } from './providers/create-user.provider';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { BcryptProvider } from './providers/bcrypt.provider';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly createUserProvider: CreateUserProvider,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    return this.createUserProvider.createUser(registerDto);
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Xác thực user
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo tokens
    const tokens = this.createTokens(user);

    // Trả về tokens
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    // Tìm user theo email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await this.bcryptProvider.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    // Trả về thông tin user (không bao gồm mật khẩu)
    const { password: _, ...result } = user;
    return result;
  }

  createTokens(user: Omit<User, 'password'>): {
    accessToken: string;
    refreshToken: string;
  } {
    // Tạo payload
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Tạo accessToken
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
    });

    // Tạo refreshToken với thời gian hết hạn dài hơn
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME || '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Xác thực refreshToken
      const payload = this.jwtService.verify(refreshToken);

      // Tìm user
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Tạo tokens mới
      return this.createTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  changePassword() {
    // Tìm user theo ID
    // Kiểm tra mật khẩu hiện tại
    // Mã hóa mật khẩu mới
    // Cập nhật mật khẩu
    return 'OK';
  }

  forgotPassword() {
    // Tìm user theo email
    // Tạo reset token
    // Gửi email với link reset password
    return 'OK';
  }

  resetPassword() {
    // Xác thực token
    // Mã hóa mật khẩu mới
    // Cập nhật mật khẩu
    return 'OK';
  }
}
