import { IAdminView } from '@web-ecom/shared-types/admin/interfaces.cjs';
import { UserRole } from '@web-ecom/shared-types/auth/index.cjs';

export class AdminUserViewDto implements IAdminView {
  id: string;

  email: string;

  username: string;

  role: UserRole;

  createdAt: Date;

  updatedAt: Date;
}
