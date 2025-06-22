import { Expose } from 'class-transformer';
import type { UserBriefFields } from '@web-ecom/shared-types';

export class UserBriefDto implements UserBriefFields {
  @Expose()
  id: string;

  @Expose()
  userName: string;

  @Expose()
  avatar?: string;
}
