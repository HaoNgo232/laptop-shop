import { IsNotEmpty, IsString } from 'class-validator';
import { IRefreshToken } from '@web-ecom/shared-types';

export class RefreshTokenDto implements IRefreshToken {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
