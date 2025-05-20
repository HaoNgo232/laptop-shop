import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Mật khẩu hiện tại',
    example: 'CurrentPass123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'Mật khẩu mới',
    example: 'NewPass123',
    required: true,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[0-9])(?=.*[a-zA-Z])/, {
    message:
      'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  newPassword: string;
}
