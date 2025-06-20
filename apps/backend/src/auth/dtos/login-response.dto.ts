import { ILoginResponse } from '@web-ecom/shared-types';
import { User } from '@/auth/entities/user.entity';

export class LoginResponseDto implements ILoginResponse {
  accessToken: string;

  refreshToken: string;

  user: Omit<User, 'passwordHash'>;
}
