import { Exclude } from 'class-transformer';
import { UserRole } from '../enums/user.role';

export class UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
