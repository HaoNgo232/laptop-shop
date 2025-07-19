import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@/products/entities/category.entity';
import { Product } from '@/products/entities/product.entity';
import { QueryProductDto } from '@/products/dtos/query-product.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { ProductDto } from '@/products/dtos/product.dto';
import { CreateProductDto } from '@/products/dtos/create-product.dto';
import { UpdateProductDto } from '@/products/dtos/update-product.dto';
import { PaginationMeta } from '@/products/interfaces/pagination-meta.interface';
import { SortOrder } from '@web-ecom/shared-types/products/enums';

interface IProductsService {
  findAll(queryDto: QueryProductDto): Promise<PaginatedResponse<ProductDto>>;
  findOne(id: string): Promise<ProductDto>;
  create(createProductDto: CreateProductDto): Promise<Product>;
  update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
  remove(id: string): Promise<void>;
}

@Injectable()
export class ProductsService implements IProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Tìm tất cả sản phẩm
   */
  async findAll(queryDto: QueryProductDto): Promise<PaginatedResponse<ProductDto>> {
    try {
      return await this.findWithFilters(queryDto);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Không thể tải danh sách sản phẩm');
    }
  }

  /**
   * Tìm sản phẩm theo ID
   */
  async findOne(id: string): Promise<ProductDto> {
    try {
      // 1. Tìm sản phẩm theo ID với relations đến category
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id}`);
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException('Không thể tải chi tiết sản phẩm');
    }
  }

  /**
   * Tạo sản phẩm
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // 1. Kiểm tra category tồn tại
      const category = await this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Không tìm thấy danh mục với ID: ${createProductDto.categoryId}`,
        );
      }

      // 2. Tạo đối tượng sản phẩm mới
      const newProduct = this.productRepository.create({
        ...createProductDto,
        category: category,
      });

      const result = await this.productRepository.save(newProduct);

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException('Không thể tạo sản phẩm mới');
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      // 1. Tìm sản phẩm theo ID
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id}`);
      }

      // 2. Nếu có categoryId, kiểm tra category tồn tại và set vào product
      if (updateProductDto.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: updateProductDto.categoryId },
        });

        if (!category) {
          throw new NotFoundException(
            `Không tìm thấy danh mục với ID: ${updateProductDto.categoryId}`,
          );
        }

        // Set category object vào product thay vì chỉ categoryId
        product.category = category;
        product.categoryId = updateProductDto.categoryId;
      }

      // 3. Cập nhật các trường khác (loại bỏ categoryId khỏi updateProductDto để tránh conflict)
      const { categoryId, ...otherFields } = updateProductDto;
      Object.assign(product, otherFields);

      // 4. Lưu vào database
      const result = await this.productRepository.save(product);

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException('Không thể cập nhật sản phẩm');
    }
  }

  /**
   * Xóa sản phẩm
   */
  async remove(id: string): Promise<void> {
    try {
      // TypeORM tự động kiểm tra sản phẩm tồn tại và chưa bị soft delete
      const deleteResult = await this.productRepository.softDelete(id);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(
          `Không tìm thấy sản phẩm với ID: ${id} để chuyển vào thùng rác!`,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException(`Không thể chuyển sản phẩm vào thùng rác`);
    }
  }

  /**
   * Khôi phục sản phẩm
   */
  async restore(id: string): Promise<Product> {
    try {
      // TypeORM tự động set deletedAt = null
      const restoreResult = await this.productRepository.restore(id);

      if (restoreResult.affected === 0) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id} để khôi phục!`);
      }

      // Lấy lại sản phẩm sau khi khôi phục để trả về
      const restoredProduct = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!restoredProduct) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id} sau khi khôi phục!`);
      }

      return restoredProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException(`Không thể khôi phục sản phẩm`);
    }
  }

  /**
   * Tìm sản phẩm với các bộ lọc và phân trang
   */
  private async findWithFilters(queryDto: QueryProductDto): Promise<PaginatedResponse<ProductDto>> {
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
      data: productsList,
      meta,
    };
  }
}
