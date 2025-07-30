import { Expose } from 'class-transformer';

export class UserBriefDto {
  @Expose()
  id: string;

  @Expose()
  userName: string;

  @Expose()
  avatar?: string;
}
