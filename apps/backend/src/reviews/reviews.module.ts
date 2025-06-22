import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './controllers/reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '@/reviews/entities/review.entity';
import { Product } from '@/products/entities/product.entity';
import { OrdersModule } from '@/orders/orders.module';
import { AuthModule } from '@/auth/auth.module';
import { AdminReviewsController } from './controllers/admin-reviews.controller';
import { CheckExistingReviewUseCase } from './use-cases/check-existing-review.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product]), OrdersModule, AuthModule],
  controllers: [ReviewsController, AdminReviewsController],
  providers: [ReviewsService, CheckExistingReviewUseCase],
})
export class ReviewsModule {}
