/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptProvider } from './bcrypt.provider';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private bcryptProvider: BcryptProvider,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    try {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email đã tồn tại');
      }

      // Mã hóa mật khẩu
      const hashedPassword: string = await this.bcryptProvider.hashPassword(
        registerDto.password,
      );

      // Kiểm tra xem mã hóa có thành công không
      if (!hashedPassword) {
        throw new InternalServerErrorException('Mã hóa mật khẩu thất bại');
      }

      // Tạo user mới
      const newUser: User = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
      });
      await this.userRepository.save(newUser);
      // // Tạo giỏ hàng cho user
      // await this.cartService.createCartForUser(newUser.id);

      const { password, ...userInfo } = newUser;
      return userInfo;
    } catch (error) {
      console.error('Error during registration:', error);
      throw new BadRequestException('Đăng ký tài khoản thất bại');
    }
  }
}
