import { IAdminUserView } from '@web-ecom/shared-types/admin/interfaces.cjs';

export class AdminUserViewDto implements IAdminUserView {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
