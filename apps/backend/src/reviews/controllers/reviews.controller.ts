import {
  Controller,
  Get,
  Post,
  Body,
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

  // Tạo review cho sản phẩm
  @Post('/:productId')
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.sub, productId, createReviewDto);
  }

  // Cập nhật review
  @Put(':reviewId')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(user.sub, reviewId, updateReviewDto);
  }

  // Xóa review
  @Delete(':reviewId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser() user: JwtPayload, @Param('reviewId') reviewId: string) {
    return this.reviewsService.delete(reviewId, user.sub, user.role as UserRole);
  }

  // Lấy danh sách review của sản phẩm
  @Auth(AuthType.None)
  @Get('/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.findByProductId(productId, query);
  }

  // Lấy review của user cho sản phẩm
  @Get('/:productId/user-review')
  async getUserReview(@CurrentUser() user: JwtPayload, @Param('productId') productId: string) {
    const { existingReview } = await this.reviewsService.checkExistingReview(user.sub, productId);
    return existingReview || null;
  }
}
