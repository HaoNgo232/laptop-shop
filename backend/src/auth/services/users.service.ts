import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@/auth/dtos/create-user.dto';
import { UpdateUserProfileDto } from '@/auth/dtos/update-profile.dto';
import { User } from '@/auth/entities/user.entity';

interface UsersService {
  findById(userId: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  create(createUserDto: CreateUserDto): Promise<User>;
  update(userId: string, updateUserDto: UpdateUserProfileDto): Promise<User>;
}

@Injectable()
export class UsersService implements UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  /**
   * Tìm user theo ID
   */
  async findById(userId: string): Promise<User> {
    if (!userId) {
      throw new BadRequestException('User ID là bắt buộc');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    return user;
  }

  /**
   * Tìm user theo email
   */
  async findByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('Email là bắt buộc');
    }
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    return user;
  }

  /**
   * Tạo user mới
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Cập nhật user
   */
  async update(userId: string, updateUserDto: UpdateUserProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    const updatedUser = { id: user.id, ...updateUserDto };

    // DTO đã được thiết kế để chỉ chứa những trường an toàn
    const result = await this.userRepository.save(updatedUser);

    return result;
  }
}
