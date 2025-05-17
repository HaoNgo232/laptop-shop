import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BcryptProvider } from './bcrypt.provider';
import { ChangePasswordDto } from '../dtos/changePassword.dto';

@Injectable()
export class ChangePasswordProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    // Tìm user theo ID
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await this.bcryptProvider.comparePassword(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await this.bcryptProvider.hashPassword(
      changePasswordDto.newPassword,
    );

    // Cập nhật mật khẩu
    user.password = hashedNewPassword;
    await this.userRepository.save(user);
  }
}
