import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Category } from '@/products/entities/category.entity';
import { CategoryDto } from '@/products/dtos/category.dto';
import { CategoryDetailDto } from '@/products/dtos/category-detail.dto';

@Injectable()
export class CategoryMapperProvider {
  /**
   * Map Category entity to CategoryDto
   */
  toCategoryDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  /**
   * Map array of Category entities to CategoryDto array
   */
  toCategoriesToDtos(categories: Category[]): CategoryDto[] {
    return categories.map((category) => this.toCategoryDto(category));
  }

  /**
   * Map Category entity with products to CategoryDetailDto
   */
  toCategoryDetailDto(category: Category): CategoryDetailDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      products:
        category.products?.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          stockQuantity: product.stockQuantity,
          category: {
            id: category.id,
            name: category.name,
          },
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })) || [],
    };
  }

  /**
   * Alternative: Using class-transformer (for more complex scenarios)
   */
  toCategoryDtoWithTransformer(category: Category): CategoryDto {
    return plainToClass(CategoryDto, category, {
      excludeExtraneousValues: true,
    });
  }
}
