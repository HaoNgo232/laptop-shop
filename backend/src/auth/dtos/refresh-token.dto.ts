import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token hợp lệ được cấp từ lần đăng nhập trước' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
