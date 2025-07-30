import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './controllers/reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '@/reviews/entities/review.entity';
import { Product } from '@/products/entities/product.entity';
import { OrdersModule } from '@/orders/orders.module';
import { AuthModule } from '@/auth/auth.module';

/**
 * Module để quản lý đánh giá sản phẩm
 */
@Module({
  imports: [TypeOrmModule.forFeature([Review, Product]), OrdersModule, AuthModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
