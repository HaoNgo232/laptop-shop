import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserProfileDto } from './dtos/user-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getUserProfile(userId: string | null): Promise<UserProfileDto> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return new UserProfileDto(user);
  }

  async updateUserProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Chỉ cập nhật những trường được phép từ DTO
    // DTO đã được thiết kế để chỉ chứa những trường an toàn
    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateProfileDto,
      // Đảm bảo các trường nhạy cảm không bị ghi đè
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });

    return new UserProfileDto(updatedUser);
  }
}
