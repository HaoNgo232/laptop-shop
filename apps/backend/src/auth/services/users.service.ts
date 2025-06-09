import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@/auth/dtos/create-user.dto';
import { UpdateUserProfileDto } from '@/auth/dtos/update-profile.dto';
import { User } from '@/auth/entities/user.entity';
import { AdminUserViewDto } from '@/admin/dtos/admin-user-view.dto';
import { AdminUserQueryDto } from '@/admin/dtos/admin-user-query.dto';
import { PaginationMeta } from '@web-ecom/shared-types/common/interfaces.cjs';
import { AdminViewDetailDto } from '@/admin/dtos/admin-view-detail.dto';
import { UpdateUserByAdminDto } from '@/admin/dtos/update-user-by-admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findById(userId: string): Promise<User> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    if (!email) {
      throw new Error('Email is required');
    }
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async update(userId: string, updateUserDto: UpdateUserProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = { id: user.id, ...updateUserDto };

    // DTO đã được thiết kế để chỉ chứa những trường an toàn
    const result = await this.userRepository.save(updatedUser);

    return result;
  }
}
