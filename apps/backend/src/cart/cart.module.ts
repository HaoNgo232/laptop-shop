import { Module, forwardRef } from '@nestjs/common';
import { CartController } from '@/cart/cart.controller';
import { CartService } from '@/cart/cart.service';
import { Cart } from '@/cart/entities/cart.entity';
import { CartItem } from '@/cart/entities/cart-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { ProductsModule } from '@/products/products.module';
import { User } from '@/auth/entities/user.entity';
import { Product } from '@/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, User, Product]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProductsModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
