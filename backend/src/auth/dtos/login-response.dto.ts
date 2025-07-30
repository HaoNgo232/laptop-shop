import { User } from '@/auth/entities/user.entity';

export class LoginResponseDto {
  accessToken: string;

  refreshToken: string;

  user: Omit<User, 'passwordHash'>;
}
