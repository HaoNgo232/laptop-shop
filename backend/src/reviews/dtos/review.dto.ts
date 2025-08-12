import { Exclude, Expose, Type } from 'class-transformer';
import { UserBriefDto } from './user-brief.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ReviewDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ type: () => UserBriefDto })
  @Type(() => UserBriefDto)
  user: UserBriefDto;

  @Expose()
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  rating: number;

  @Expose()
  @ApiProperty({ required: false })
  comment: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
