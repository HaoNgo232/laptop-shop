import { User } from '../entities/user.entity';

export class LoginResponseDto {
  accessToken: string;

  refreshToken: string;

  user: User;
}
