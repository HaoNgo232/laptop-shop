import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Category } from '../entities/category.entity';
import { CategoryDto } from '../dtos/category.dto';
import { CategoryDetailDto } from '../dtos/category-detail.dto';
import { ProductDto } from '../dtos/product.dto';

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
          image_url: product.image_url,
          stock_quantity: product.stock_quantity,
          category: {
            id: category.id,
            name: category.name,
          },
          created_at: product.created_at,
          updated_at: product.updated_at,
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
