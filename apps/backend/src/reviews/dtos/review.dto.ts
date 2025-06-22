import { Exclude, Expose, Type } from 'class-transformer';
import { UserBriefDto } from './user-brief.dto';
import type { ReviewEntityFields } from '@web-ecom/shared-types';

@Exclude()
export class ReviewDto implements ReviewEntityFields {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserBriefDto)
  user: UserBriefDto;

  @Expose()
  rating: number;

  @Expose()
  comment: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
