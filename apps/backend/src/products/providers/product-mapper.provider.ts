import { Injectable } from '@nestjs/common';
import { Product } from '@/products/entities/product.entity';
import { Category } from '@/products/entities/category.entity';
import { ProductDto } from '@/products/dtos/product.dto';
import { ProductDetailDto } from '@/products/dtos/product-detail.dto';
import { CategoryDto } from '@/products/dtos/category.dto';

@Injectable()
export class ProductMapperProvider {
  /**
   * Map Product entity to ProductDto
   */
  toProductDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  /**
   * Map array of Product entities to ProductDto array
   */
  toProductDtos(products: Product[]): ProductDto[] {
    return products.map((product) => this.toProductDto(product));
  }

  /**
   * Map Product entity to ProductDetailDto
   */
  toProductDetailDto(product: Product): ProductDetailDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url,
      category: this.mapCategoryToDto(product.category),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  /**
   * Map Category entity to CategoryDto for Product relations
   */
  private mapCategoryToDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
