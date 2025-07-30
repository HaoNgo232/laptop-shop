import { UserRole } from '@/auth/enums/user-role.enum';

export class AdminUserViewDto {
  id: string;

  email: string;

  username: string;

  role: UserRole;

  createdAt: Date;

  updatedAt: Date;
}
