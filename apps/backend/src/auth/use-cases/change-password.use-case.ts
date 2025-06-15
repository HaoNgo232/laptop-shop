import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptProvider } from '@/auth/providers/bcrypt.provider';
import { ChangePasswordDto } from '@/auth/dtos/change-password.dto';
import { User } from '@/auth/entities/user.entity';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async execute(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // Tìm user theo ID
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await this.bcryptProvider.comparePassword(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await this.bcryptProvider.hashPassword(changePasswordDto.newPassword);

    // Cập nhật mật khẩu
    user.passwordHash = hashedNewPassword;
    await this.userRepository.save(user);
    return { message: 'Mật khẩu đã được thay đổi thành công' };
  }
}
