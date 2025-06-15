import { IAdminDetail } from '@web-ecom/shared-types/admin/interfaces.cjs';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { ApiProperty } from '@nestjs/swagger';

export class AdminViewDetailDto implements IAdminDetail {
  @ApiProperty({
    description: 'ID của người dùng',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  id: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Tên đăng nhập của người dùng',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Địa chỉ của người dùng',
    example: '123 Đường ABC, Quận 1, TP.HCM',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Số điện thoại của người dùng',
    example: '0901234567',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Vai trò của người dùng',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Ngày tạo tài khoản',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Ngày cập nhật cuối cùng',
    example: '2024-01-02T00:00:00.000Z',
  })
  updatedAt: Date;
}
