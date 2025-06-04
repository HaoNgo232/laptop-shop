import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptProvider } from '@/auth/providers/bcrypt.provider';
import { User } from '@/auth/entities/user.entity';

@Injectable()
export class ValidateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptProvider: BcryptProvider, // Inject BcryptProvider
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    // Tìm user theo email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await this.bcryptProvider.comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    return user;
  }
}
