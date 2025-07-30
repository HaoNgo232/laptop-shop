import { Exclude, Expose, Type } from 'class-transformer';
import { UserBriefDto } from './user-brief.dto';

@Exclude()
export class ReviewDto {
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
