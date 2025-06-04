import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto extends PartialType(RegisterUserDto) {}
