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
import { RegisterUserDto } from '../dtos/register-user.dto';
import { MailService } from '../../mail/mail.service';
import { CartService } from '../../cart/cart.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptProvider: BcryptProvider,
    private readonly mailService: MailService,
    private readonly cartService: CartService,
  ) {}

  async createUser(registerUserDto: RegisterUserDto) {
    try {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await this.userRepository.findOne({
        where: { email: registerUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email đã tồn tại');
      }

      // Mã hóa mật khẩu
      const hashedPassword: string = await this.bcryptProvider.hashPassword(
        registerUserDto.password,
      );

      // Kiểm tra xem mã hóa có thành công không
      if (!hashedPassword) {
        throw new InternalServerErrorException('Mã hóa mật khẩu thất bại');
      }

      // Tạo user mới
      const newUser: User = this.userRepository.create({
        ...registerUserDto,
        password_hash: hashedPassword,
      });
      await this.userRepository.save(newUser);
      // Tạo giỏ hàng cho user
      await this.cartService.getCartEntityByUserId(newUser.id);

      // try {
      //   await this.mailService.sendUserWelcomeEmail(newUser);
      // } catch (error) {
      //   throw new RequestTimeoutException(error);
      // }

      return newUser;
    } catch (error) {
      throw new BadRequestException(error, 'Đăng ký tài khoản thất bại');
    }
  }
}
