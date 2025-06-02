import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

import { ProductsService } from './services/products.service';
import { CategoriesService } from './services/categories.service';

import { ProductsController } from './controllers/products.controller';
import { CategoriesController } from './controllers/categories.controller';
import { AdminProductsController } from './controllers/admin-products.controller';
import { AdminCategoriesController } from './controllers/admin-categories.controller';
import { ProductsProvider } from './providers/products.provider';
import { CategoryMapperProvider } from './providers/category-mapper.provider';
import { ProductMapperProvider } from './providers/product-mapper.provider';
import { CartModule } from '../cart/cart.module';
import { AuthModule } from '../auth/auth.module';

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
