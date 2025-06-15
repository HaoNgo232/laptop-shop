import { IAdminView } from '@web-ecom/shared-types/admin/interfaces.cjs';
import { UserRole } from '@web-ecom/shared-types/auth/index.cjs';
import { ApiProperty } from '@nestjs/swagger';

export class AdminUserViewDto implements IAdminView {
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
