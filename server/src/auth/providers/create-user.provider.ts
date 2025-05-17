import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptProvider } from './bcrypt.provider';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dtos/register.dto';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptProvider: BcryptProvider,
    private readonly mailService: MailService,
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

      try {
        await this.mailService.sendUserWelcomeEmail(newUser);
      } catch (error) {
        throw new RequestTimeoutException(error);
      }

      const { password, ...userInfo } = newUser;
      return userInfo;
    } catch (error) {
      throw new BadRequestException('Đăng ký tài khoản thất bại');
    }
  }
}
