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
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('⭐ Reviews')
@ApiExtraModels(CreateReviewDto, UpdateReviewDto, PaginationQueryDto)
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Tạo review cho sản phẩm
  @Post('/:productId')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Tạo đánh giá cho sản phẩm' })
  @ApiOkResponse({ description: 'Đã tạo/cập nhật đánh giá cho sản phẩm.' })
  @ApiParam({ name: 'productId', description: 'ID sản phẩm' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.sub, productId, createReviewDto);
  }

  // Cập nhật review
  @Put(':reviewId')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Cập nhật đánh giá' })
  @ApiOkResponse({ description: 'Cập nhật đánh giá thành công.' })
  @ApiParam({ name: 'reviewId', description: 'ID review' })
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
  @Auth(AuthType.Bearer)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Xóa đánh giá' })
  @ApiNoContentResponse({ description: 'Đã xóa đánh giá.' })
  @ApiParam({ name: 'reviewId', description: 'ID review' })
  async remove(@CurrentUser() user: JwtPayload, @Param('reviewId') reviewId: string) {
    return this.reviewsService.delete(reviewId, user.sub, user.role as UserRole);
  }

  // Lấy danh sách review của sản phẩm
  @Auth(AuthType.None)
  @Get('/:productId')
  @ApiOperation({ summary: 'Danh sách đánh giá theo sản phẩm' })
  @ApiOkResponse({ description: 'Danh sách review của sản phẩm.' })
  @ApiParam({ name: 'productId', description: 'ID sản phẩm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getProductReviews(
    @Param('productId') productId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.findByProductId(productId, query);
  }
}
