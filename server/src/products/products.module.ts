import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

import { ProductsService } from './services/products.service';
import { CategoriesService } from './services/categories.service';

import { ProductsController } from './controllers/products.controller';
import { CategoriesController } from './controllers/categories.controller';
import { AdminProductsController } from './controllers/admin-products.controller';
import { AdminCategoriesController } from './controllers/admin-categories.controller';
import { TokenBlacklistProvider } from '../auth/providers/token-blacklist.provider';
import { ProductsProvider } from './providers/produsts.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), AuthModule],
  controllers: [
    ProductsController,
    CategoriesController,
    AdminProductsController,
    AdminCategoriesController,
  ],
  providers: [ProductsService, CategoriesService, ProductsProvider],
  exports: [ProductsService, CategoriesService],
})
export class ProductsModule {}
