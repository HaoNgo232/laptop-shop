import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from '@/reviews/reviews.service';
import { CreateReviewDto } from '@/reviews/dtos/create-review.dto';
import { UpdateReviewDto } from '@/reviews/dtos/update-review.dto';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Auth(AuthType.None)
  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.findByProductId(productId, query);
  }

  @Post('product/:productId')
  async createReview(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.sub, productId, createReviewDto);
  }

  @Put(':reviewId')
  async updateReview(
    @CurrentUser() user: JwtPayload,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(user.sub, reviewId, updateReviewDto);
  }

  @Get('product/:productId/user-review')
  async getUserReview(@CurrentUser() user: JwtPayload, @Param('productId') productId: string) {
    const { existingReview } = await this.reviewsService.checkExistingReview(user.sub, productId);
    return existingReview || null;
  }

  @Delete(':reviewId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@CurrentUser() user: JwtPayload, @Param('reviewId') reviewId: string) {
    return this.reviewsService.delete(reviewId, user.sub, user.role as UserRole);
  }
}
