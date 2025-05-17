import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { BcryptProvider } from './bcrypt.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ValidateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptProvider: BcryptProvider, // Inject BcryptProvider
  ) {}
  async verifyUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    // Tìm user theo email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await this.bcryptProvider.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    // Trả về thông tin user (không bao gồm mật khẩu)
    const { password: _, ...result } = user;
    return result;
  }
}
