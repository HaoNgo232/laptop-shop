import { AuthModule } from '@/auth/auth.module';
import { CartModule } from '@/cart/cart.module';
import { AdminCategoriesController } from '@/products/controllers/admin-categories.controller';
import { AdminProductsController } from '@/products/controllers/admin-products.controller';
import { CategoriesController } from '@/products/controllers/categories.controller';
import { ProductsController } from '@/products/controllers/products.controller';
import { Category } from '@/products/entities/category.entity';
import { Product } from '@/products/entities/product.entity';
import { CategoryMapperProvider } from '@/products/providers/category-mapper.provider';
import { ProductMapperProvider } from '@/products/providers/product-mapper.provider';
import { ProductsProvider } from '@/products/providers/products.provider';
import { CategoriesService } from '@/products/services/categories.service';
import { ProductsService } from '@/products/services/products.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    forwardRef(() => CartModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [
    ProductsController,
    CategoriesController,
    AdminProductsController,
    AdminCategoriesController,
  ],
  providers: [
    ProductsService,
    CategoriesService,
    CategoryMapperProvider,
    ProductMapperProvider,
    ProductsProvider,
  ],
  exports: [
    ProductsService,
    CategoriesService,
    CategoryMapperProvider,
    ProductMapperProvider,
    ProductsProvider,
  ],
})
export class ProductsModule {}
