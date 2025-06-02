import { UpdateUserProfileDto } from './../dtos/update-profile.dto';
import { CreateUserDto } from './../dtos/create-user.dto';
import { User } from './../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async update(
    userId: string,
    updateUserDto: UpdateUserProfileDto,
  ): Promise<User> {
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
