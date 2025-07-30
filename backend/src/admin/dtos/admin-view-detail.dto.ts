import { UserRole } from '@/auth/enums/user-role.enum';

export class AdminViewDetailDto {
  id: string;

  email: string;

  username: string;

  address?: string;

  phoneNumber?: string;

  role: UserRole;

  createdAt: Date;

  updatedAt: Date;
}
