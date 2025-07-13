import { DebugUtil } from '@/common/utils/debug.util';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { AdminOrdersService } from '@/orders/services/admin-orders.service';
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
    private readonly adminOrdersService: AdminOrdersService,
    private readonly checkExistingReviewUseCase: CheckExistingReviewUseCase,
    private readonly dataSource: DataSource,
  ) {}
  /**
   * Tạo review mới
   */
  async create(
    userId: string,
    productId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    try {
      // Bước 1: Kiểm tra xem user đã review sản phẩm này chưa
      // Sử dụng use case để tách biệt logic kiểm tra duplicate review
      const { hasReviewed } = await this.checkExistingReviewUseCase.execute({
        userId,
        productId,
      });

      // Nếu đã review rồi thì throw exception để ngăn duplicate
      if (hasReviewed) {
        throw new DuplicateReviewException('Bạn đã đánh giá sản phẩm này rồi.');
      }

      // Bước 2: Kiểm tra xem user có thực sự đã mua sản phẩm này không
      // Chỉ những ai đã mua mới được phép review (business rule)
      const hasPurchased = await this.adminOrdersService.hasPurchasedProduct(userId, productId);
      if (!hasPurchased) {
        throw new ForbiddenException('Bạn phải mua sản phẩm để có thể đánh giá.');
      }

      // Bước 3: Kiểm tra sản phẩm có tồn tại không
      // Đảm bảo không review cho sản phẩm không tồn tại
      const product = await this.productRepository.findOneBy({ id: productId });
      if (!product) {
        throw new NotFoundException('Không tìm thấy sản phẩm.');
      }

      // Bước 4: Tạo review trong transaction
      // Transaction đảm bảo tính nhất quán: tạo review và cập nhật rating sản phẩm
      // phải cùng thành công hoặc cùng thất bại
      const result = await this.dataSource.transaction(async (transactionalEntityManager) => {
        // Tạo entity review mới với dữ liệu từ DTO
        const review = transactionalEntityManager.create(Review, {
          ...createReviewDto,
          user: { id: userId },
          product: { id: productId },
        });

        // Lưu review vào database
        const savedReview = await transactionalEntityManager.save(review);

        // Tính lại rating trung bình cho sản phẩm sau khi có review mới
        await this.recalculateProductRating(productId, transactionalEntityManager);

        return savedReview;
      });

      return result;
    } catch (error) {
      // Log lỗi để debug và rethrow để controller xử lý
      DebugUtil.timeEnd('review-creation');
      DebugUtil.logError('ReviewService.create', error, { userId, productId, createReviewDto });
      throw error;
    }
  }

  /**
   * Cập nhật review
   */
  async update(userId: string, reviewId: string, updateReviewDto: UpdateReviewDto) {
    // Bước 1: Tìm review cần update kèm theo thông tin user và product
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { user: true, product: true },
    });

    // Bước 2: Kiểm tra review có tồn tại không
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá.');
    }

    // Bước 3: Kiểm tra quyền sở hữu - chỉ owner mới được update
    if (review.user.id !== userId) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật đánh giá của mình.');
    }

    // Bước 4: Merge dữ liệu mới vào review entity
    Object.assign(review, updateReviewDto);

    // Bước 5: Update trong transaction để đảm bảo tính nhất quán
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      // Lưu review đã được update
      const updatedReview = await transactionalEntityManager.save(review);

      // Tính lại rating sản phẩm vì rating có thể đã thay đổi
      await this.recalculateProductRating(review.product.id, transactionalEntityManager);

      return updatedReview;
    });
  }

  /**
   * Xóa review
   */
  async delete(reviewId: string, userId: string, userRole: UserRole): Promise<void> {
    // Bước 1: Tìm review cần xóa kèm theo thông tin user và product
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { user: true, product: true },
    });

    // Bước 2: Kiểm tra review có tồn tại không
    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá.');
    }

    // Bước 3: Kiểm tra quyền xóa - owner hoặc admin mới được xóa
    const isOwner = review.user.id === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này.');
    }

    // Bước 4: Xóa review trong transaction để đảm bảo tính nhất quán
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Xóa review khỏi database
      await transactionalEntityManager.remove(review);

      // Tính lại rating sản phẩm sau khi xóa review
      await this.recalculateProductRating(review.product.id, transactionalEntityManager);
    });
  }

  /**
   * Tìm review theo productId
   */
  async findByProductId(productId: string, query: PaginationQueryDto) {
    // Bước 1: Tính toán pagination parameters
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Bước 2: Query reviews của sản phẩm với pagination
    const [data, total] = await this.reviewRepository.findAndCount({
      where: { product: { id: productId } },
      relations: { user: true }, // Load thông tin user để hiển thị
      order: { createdAt: 'DESC' }, // Sắp xếp theo thời gian tạo mới nhất
      take: limit,
      skip,
    });

    // Bước 3: Tạo response object với metadata pagination
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

  /**
   * Tìm tất cả review cho admin
   */
  async findAllForAdmin(query: AdminReviewQueryDto) {
    // Bước 1: Extract query parameters với default values
    const { page = 1, limit = 10, userId, productId } = query;
    const skip = (page - 1) * limit;

    // Bước 2: Tạo query builder để build dynamic query
    const queryBuilder = this.reviewRepository.createQueryBuilder('review');

    // Bước 3: Join với user và product để lấy thông tin đầy đủ
    queryBuilder
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product')
      .orderBy('review.createdAt', 'DESC')
      .take(limit)
      .skip(skip);

    // Bước 4: Thêm filter conditions nếu có
    if (userId) {
      queryBuilder.andWhere('review.user_id = :userId', { userId });
    }
    if (productId) {
      queryBuilder.andWhere('review.product_id = :productId', { productId });
    }

    // Bước 5: Execute query để lấy data và count
    const [data, total] = await queryBuilder.getManyAndCount();

    // Bước 6: Tạo response với pagination metadata
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

  /**
   * Kiểm tra review đã tồn tại
   */
  async checkExistingReview(userId: string, productId: string) {
    // Delegate việc kiểm tra existing review cho use case
    // Tuân thủ Single Responsibility Principle
    return this.checkExistingReviewUseCase.execute({ userId, productId });
  }

  /**
   * Tính lại rating trung bình và số lượng review cho sản phẩm
   * Method này phải được chạy trong transaction khi có review được tạo/sửa/xóa
   * để đảm bảo tính nhất quán dữ liệu
   */
  private async recalculateProductRating(productId: string, manager: EntityManager) {
    // Bước 1: Tính toán rating trung bình và số lượng review
    const stats = (await manager
      .getRepository(Review)
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('review.product_id = :productId', { productId })
      .getRawOne()) as { averageRating: string; reviewCount: string };

    // Bước 2: Parse kết quả từ string sang number với fallback values
    const averageRating = stats.averageRating ? parseFloat(stats.averageRating) : 0;
    const reviewCount = stats.reviewCount ? parseInt(stats.reviewCount) : 0;

    // Bước 3: Update thông tin rating vào product entity
    await manager.update(Product, productId, {
      averageRating: Number(averageRating.toFixed(2)), // Làm tròn 2 chữ số thập phân
      reviewCount,
    });
  }
}
