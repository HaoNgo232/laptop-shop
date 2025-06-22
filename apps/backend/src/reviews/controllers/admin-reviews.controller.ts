import { Auth } from '@/auth/decorators/auth.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { type JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { AdminReviewQueryDto } from '@/reviews/dtos/admin-review-query.dto';
import { ReviewsService } from '@/reviews/reviews.service';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';

@Controller('api/admin/reviews')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getAllReviews(@Query() query: AdminReviewQueryDto) {
    return this.reviewsService.findAllForAdmin(query);
  }

  @Delete(':reviewId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@Param('reviewId') reviewId: string, @CurrentUser() user: JwtPayload) {
    await this.reviewsService.delete(reviewId, user.sub, user.role as UserRole);
  }
}
