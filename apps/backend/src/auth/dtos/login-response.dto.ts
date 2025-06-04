import { ILoginResponse } from '@web-ecom/shared-types';
import { UserProfileDto } from '@/auth/dtos/user-profile.dto';

export class LoginResponseDto implements ILoginResponse {
  accessToken: string;

  refreshToken: string;

  user: UserProfileDto;
}
