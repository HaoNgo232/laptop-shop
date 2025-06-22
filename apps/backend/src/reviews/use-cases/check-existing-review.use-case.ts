import { Review } from '@/reviews/entities/review.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface CheckExistingReviewInput {
  userId: string;
  productId: string;
}

export interface CheckExistingReviewOutput {
  hasReviewed: boolean;
  existingReview?: Review;
}

/**
 * Use-case để check xem user đã review sản phẩm này chưa
 * Tuân thủ Single Responsibility Principle - chỉ làm một việc duy nhất
 */
@Injectable()
export class CheckExistingReviewUseCase {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async execute(input: CheckExistingReviewInput): Promise<CheckExistingReviewOutput> {
    const { userId, productId } = input;

    const existingReview = await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: {
        user: true,
        product: true,
      },
    });

    return {
      hasReviewed: !!existingReview,
      existingReview: existingReview || undefined,
    };
  }
}
