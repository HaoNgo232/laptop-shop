import { DebugUtil } from '@/common/utils/debug.util';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { AdminOrdersService } from '@/orders/services/admin-orders.service';
import { Product } from '@/products/entities/product.entity';
import { CreateReviewDto } from '@/reviews/dtos/create-review.dto';
import { AdminReviewQueryDto } from '@/reviews/dtos/admin-review-query.dto';
import { UpdateReviewDto } from '@/reviews/dtos/update-review.dto';
import { Review } from '@/reviews/entities/review.entity';
import { DuplicateReviewException } from '@/reviews/exceptions/duplicate-review.exception';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { DataSource, Repository } from 'typeorm';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';

interface IReviewsService {
  create(userId: string, productId: string, createReviewDto: CreateReviewDto): Promise<Review>;
  update(userId: string, reviewId: string, updateReviewDto: UpdateReviewDto): Promise<Review>;
  delete(reviewId: string, userId: string, userRole: UserRole): Promise<void>;
  findByProductId(productId: string, query: PaginationQueryDto): Promise<PaginatedResponse<Review>>;
  findAllForAdmin(query: AdminReviewQueryDto): Promise<PaginatedResponse<Review>>;
}

@Injectable()
export class ReviewsService implements IReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly adminOrdersService: AdminOrdersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    productId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    try {
      // Kiểm tra các điều kiện business rules
      await this.validateCreateReview(userId, productId);

      // Tạo review trực tiếp
      const review = this.reviewRepository.create({
        ...createReviewDto,
        user: { id: userId },
        product: { id: productId },
      });

      const savedReview = await this.reviewRepository.save(review);

      // Update rating async (không block response)
      this.updateProductRatingAsync(productId).catch((error) => {
        console.error('Background rating update failed:', error);
      });

      return savedReview;
    } catch (error) {
      DebugUtil.timeEnd('review-creation');
      DebugUtil.logError('ReviewService.create', error, { userId, productId, createReviewDto });
      throw error;
    }
  }

  async update(userId: string, reviewId: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { user: true, product: true },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá.');
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật đánh giá của mình.');
    }

    Object.assign(review, updateReviewDto);
    const updatedReview = await this.reviewRepository.save(review);

    // Update rating async
    this.updateProductRatingAsync(review.product.id).catch((error) => {
      console.error('Background rating update failed:', error);
    });

    return updatedReview;
  }

  async delete(reviewId: string, userId: string, userRole: UserRole): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { user: true, product: true },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá.');
    }

    const isOwner = review.user.id === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này.');
    }

    const productId = review.product.id;
    await this.reviewRepository.remove(review);

    // Update rating async
    this.updateProductRatingAsync(productId).catch((error) => {
      console.error('Background rating update failed:', error);
    });
  }

  async findByProductId(productId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.reviewRepository.findAndCount({
      where: { product: { id: productId } },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return this.buildPaginatedResponse(data, total, page, limit);
  }

  async findAllForAdmin(query: AdminReviewQueryDto) {
    const { page = 1, limit = 10, userId, productId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product')
      .orderBy('review.createdAt', 'DESC')
      .take(limit)
      .skip(skip);

    if (userId) {
      queryBuilder.andWhere('review.user_id = :userId', { userId });
    }
    if (productId) {
      queryBuilder.andWhere('review.product_id = :productId', { productId });
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return this.buildPaginatedResponse(data, total, page, limit);
  }

  // Kiểm tra các điều kiện trước khi tạo review
  private async validateCreateReview(userId: string, productId: string): Promise<void> {
    const [existingReview, hasPurchased, product] = await Promise.all([
      this.reviewRepository.findOne({
        where: { user: { id: userId }, product: { id: productId } },
      }),
      this.adminOrdersService.hasPurchasedProduct(userId, productId),
      this.productRepository.findOneBy({ id: productId }),
    ]);

    if (existingReview) {
      throw new DuplicateReviewException('Bạn đã đánh giá sản phẩm này rồi.');
    }

    if (!hasPurchased) {
      throw new ForbiddenException('Bạn phải mua sản phẩm để có thể đánh giá.');
    }

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm.');
    }
  }

  // Update rating async (không block main flow)
  private async updateProductRatingAsync(productId: string): Promise<void> {
    try {
      const stats = (await this.reviewRepository
        .createQueryBuilder('review')
        .select('AVG(review.rating)', 'averageRating')
        .addSelect('COUNT(review.id)', 'reviewCount')
        .where('review.product_id = :productId', { productId })
        .getRawOne()) as { averageRating: string; reviewCount: string };

      const averageRating = stats.averageRating ? parseFloat(stats.averageRating) : 0;
      const reviewCount = stats.reviewCount ? parseInt(stats.reviewCount) : 0;

      await this.productRepository.update(productId, {
        averageRating: Number(averageRating.toFixed(2)),
        reviewCount,
      });
    } catch (error) {
      // Log error nhưng không throw để không ảnh hưởng main flow
      console.error('Failed to update product rating:', error);
    }
  }

  // Tạo response pagination
  private buildPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    return {
      data,
      meta: {
        totalItems: total,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(total / limit),
      },
    };
  }
}
