import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token khôi phục mật khẩu',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Mật khẩu mới',
    example: 'NewPass123',
    required: true,
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({
    description: 'Nhập lại mật khẩu mới',
    example: 'NewPass123',
    required: true,
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
