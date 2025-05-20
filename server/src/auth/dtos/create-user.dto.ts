import { PartialType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';

export class CreateUserDto extends PartialType(RegisterUserDto) {}
