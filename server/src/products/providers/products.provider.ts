import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { QueryProductDto, SortOrder } from '../dtos/query-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';
import { PaginationMeta } from '../interfaces/pagination-meta.interface';
import { ProductMapperProvider } from './product-mapper.provider';

@Injectable()
export class ProductsProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly productMapper: ProductMapperProvider,
  ) {}

  async findAllProducts(
    queryDto: QueryProductDto,
  ): Promise<PaginatedResponse<ProductDto>> {
    // 1. Trích xuất tham số truy vấn
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = SortOrder.DESC,
      search,
      price_min,
      price_max,
      category_id,
    } = queryDto;

    // 2. Xây dựng query với điều kiện lọc
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // Áp dụng các bộ lọc nếu có
    if (search) {
      queryBuilder.andWhere('product.name LIKE :name', { name: `%${search}%` });
    }

    if (price_min !== undefined) {
      queryBuilder.andWhere('product.price >= :price_min', { price_min });
    }

    if (price_max !== undefined) {
      queryBuilder.andWhere('product.price <= :price_max', { price_max });
    }

    if (category_id) {
      queryBuilder.andWhere('product.category_id = :category_id', {
        category_id,
      });
    }

    // 3. Tính toán phân trang
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // 4. Áp dụng sắp xếp
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    // 5. Thực thi truy vấn
    const [products_list, total] = await queryBuilder.getManyAndCount();

    // 6. Map dữ liệu sang DTO sử dụng mapper
    const data = this.productMapper.toProductDtos(products_list);

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
