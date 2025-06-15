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
import { ProductMapperProvider } from '@/products/providers/product-mapper.provider';
import { ProductsProvider } from '@/products/providers/products.provider';
import { QueryProductDto } from '@/products/dtos/query-product.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { ProductDto } from '@/products/dtos/product.dto';
import { ProductDetailDto } from '@/products/dtos/product-detail.dto';
import { CreateProductDto } from '@/products/dtos/create-product.dto';
import { UpdateProductDto } from '@/products/dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly productsProvider: ProductsProvider,
    private readonly productMapper: ProductMapperProvider,
  ) {}

  async findAll(queryDto: QueryProductDto): Promise<PaginatedResponse<ProductDto>> {
    try {
      return await this.productsProvider.findAllProducts(queryDto);
    } catch (error) {
      throw new NotAcceptableException('Không thể tải danh sách sản phẩm');
    }
  }

  async findOne(id: string): Promise<ProductDetailDto> {
    try {
      // 1. Tìm sản phẩm theo ID với relations đến category
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id}`);
      }

      return this.productMapper.toProductDetailDto(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException('Không thể tải chi tiết sản phẩm');
    }
  }

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

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      // 1. Tìm sản phẩm theo ID
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id}`);
      }

      // 3. Nếu có category_id, kiểm tra category tồn tại
      if (updateProductDto.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: updateProductDto.categoryId },
        });

        if (!category) {
          throw new NotFoundException(
            `Không tìm thấy danh mục với ID: ${updateProductDto.categoryId}`,
          );
        }
      }
      // 4. Cập nhật thông tin sản phẩm
      Object.assign(product, updateProductDto);
      // 5. Lưu vào database
      const result = await this.productRepository.save(product);
      // 6. Trả về sản phẩm đã cập nhật

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException('Không thể cập nhật sản phẩm');
    }
  }

  async remove(id: string): Promise<string> {
    try {
      // 1. Tìm sản phẩm với orderItems relation
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['orderItems'],
      });

      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id}`);
      }

      // 2. ✅ Kiểm tra orderItems trực tiếp
      if (product.orderItems && product.orderItems.length > 0) {
        // ✅ Soft delete: Set stock = 0 thay vì xóa
        await this.productRepository.update(id, {
          stockQuantity: 0,
        });

        return `Sản phẩm "${product.name}" đã được ẩn khỏi hệ thống vì có trong ${product.orderItems.length} đơn hàng`;
      }

      // 3. Nếu không có ràng buộc, xóa bình thường
      await this.productRepository.remove(product);
      return `Xóa sản phẩm "${product.name}" thành công`;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);

      // ✅ Handle specific foreign key error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23503') {
        throw new BadRequestException('Sản phẩm đã có trong đơn hàng, không thể xóa.');
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new NotAcceptableException(`Không thể xóa sản phẩm`);
    }
  }
}
