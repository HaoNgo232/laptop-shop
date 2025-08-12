import { User } from '@/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'Thông tin người dùng (ẩn passwordHash)' })
  user: Omit<User, 'passwordHash'>;
}
