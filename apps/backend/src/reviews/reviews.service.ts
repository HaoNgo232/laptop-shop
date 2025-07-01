import { DebugUtil } from '@/common/utils/debug.util';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { OrdersService } from '@/orders/orders.service';
import { Product } from '@/products/entities/product.entity';
import { CreateReviewDto } from '@/reviews/dtos/create-review.dto';
import { AdminReviewQueryDto } from '@/reviews/dtos/admin-review-query.dto';
import { UpdateReviewDto } from '@/reviews/dtos/update-review.dto';
import { Review } from '@/reviews/entities/review.entity';
import { DuplicateReviewException } from '@/reviews/exceptions/duplicate-review.exception';
import { CheckExistingReviewUseCase } from '@/reviews/use-cases/check-existing-review.use-case';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@web-ecom/shared-types/auth/enums.cjs';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
    private readonly ordersService: OrdersService,
    private readonly checkExistingReviewUseCase: CheckExistingReviewUseCase,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    productId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    try {
      // 1. Check if user has already reviewed this product
      const { hasReviewed, existingReview } = await this.checkExistingReviewUseCase.execute({
        userId,
        productId,
      });

      if (hasReviewed) {
        throw new DuplicateReviewException();
      }

      // 2. Check if user has purchased the product
      const hasPurchased = await this.ordersService.hasPurchasedProduct(userId, productId);
      if (!hasPurchased) {
        throw new ForbiddenException('Bạn phải mua sản phẩm để có thể đánh giá.');
      }

      // 3. Check if product exists
      const product = await this.productRepository.findOneBy({ id: productId });
      if (!product) {
        throw new NotFoundException('Không tìm thấy sản phẩm.');
      }

      // 4. Create review in transaction
      // The transaction ensures that creating a review and updating the product's rating
      // either both succeed or both fail. This maintains data consistency.
      const result = await this.dataSource.transaction(async (transactionalEntityManager) => {
        const review = transactionalEntityManager.create(Review, {
          ...createReviewDto,
          user: { id: userId },
          product: { id: productId },
        });
        const savedReview = await transactionalEntityManager.save(review);

        await this.recalculateProductRating(productId, transactionalEntityManager);

        return savedReview;
      });

      return result;
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

    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const updatedReview = await transactionalEntityManager.save(review);
      await this.recalculateProductRating(review.product.id, transactionalEntityManager);
      return updatedReview;
    });
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

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.remove(review);
      await this.recalculateProductRating(review.product.id, transactionalEntityManager);
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
    const result: PaginatedResponse<Review> = {
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
    return result;
  }

  async findAllForAdmin(query: AdminReviewQueryDto) {
    const { page = 1, limit = 10, userId, productId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reviewRepository.createQueryBuilder('review');
    queryBuilder
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

    const result: PaginatedResponse<Review> = {
      data,
      meta: {
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(total / limit),
        totalItems: total,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return result;
  }

  async checkExistingReview(userId: string, productId: string) {
    return this.checkExistingReviewUseCase.execute({ userId, productId });
  }

  /**
   * Recalculates the average rating and review count for a product.
   * This should be run inside a transaction whenever a review is created, updated, or deleted.
   */
  private async recalculateProductRating(productId: string, manager: EntityManager) {
    const stats = (await manager
      .getRepository(Review)
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('review.product_id = :productId', { productId })
      .getRawOne()) as { averageRating: string; reviewCount: string };

    const averageRating = stats.averageRating ? parseFloat(stats.averageRating) : 0;
    const reviewCount = stats.reviewCount ? parseInt(stats.reviewCount) : 0;

    await manager.update(Product, productId, {
      averageRating: Number(averageRating.toFixed(2)),
      reviewCount,
    });
  }
}
