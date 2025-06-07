import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/products/entities/product.entity';
import { Category } from '@/products/entities/category.entity';
import { QueryProductDto } from '@/products/dtos/query-product.dto';
import { ProductDto } from '@/products/dtos/product.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { PaginationMeta } from '@/products/interfaces/pagination-meta.interface';
import { ProductMapperProvider } from '@/products/providers/product-mapper.provider';
import { SortOrder } from '@web-ecom/shared-types/products/enums';

@Injectable()
export class ProductsProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly productMapper: ProductMapperProvider,
  ) {}

  async findAllProducts(queryDto: QueryProductDto): Promise<PaginatedResponse<ProductDto>> {
    // 1. Trích xuất tham số truy vấn
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      search,
      priceMin,
      priceMax,
      categoryId,
    } = queryDto;

    // 2. Xây dựng query với điều kiện lọc
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // Áp dụng các bộ lọc nếu có
    if (search) {
      queryBuilder.andWhere('product.name LIKE :name', { name: `%${search}%` });
    }

    if (priceMin !== undefined) {
      queryBuilder.andWhere('product.price >= :priceMin', { priceMin });
    }

    if (priceMax !== undefined) {
      queryBuilder.andWhere('product.price <= :priceMax', { priceMax });
    }

    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId,
      });
    }

    // 3. Tính toán phân trang
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // 4. Áp dụng sắp xếp
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    // 5. Thực thi truy vấn
    const [productsList, total] = await queryBuilder.getManyAndCount();

    // 6. Map dữ liệu sang DTO sử dụng mapper
    const data = this.productMapper.toProductDtos(productsList);

    // 7. Tạo metadata phân trang
    const meta: PaginationMeta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };

    // Trả về kết quả đã phân trang
    return {
      data,
      meta,
    };
  }
}
