import { IAdminDetail } from '@web-ecom/shared-types/admin/interfaces.cjs';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';

export class AdminViewDetailDto implements IAdminDetail {
  id: string;
  email: string;
  username: string;
  address?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
