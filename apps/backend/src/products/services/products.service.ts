import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.productsProvider.findAllProducts(queryDto);
  }

  async findOne(id: string): Promise<ProductDetailDto> {
    // 1. Tìm sản phẩm theo ID với relations đến category
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id}`);
    }

    return this.productMapper.toProductDetailDto(product);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // 1. Kiểm tra category tồn tại
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.category_id },
    });

    if (!category) {
      throw new NotFoundException(
        `Không tìm thấy danh mục với ID: ${createProductDto.category_id}`,
      );
    }

    // 2. Tạo đối tượng sản phẩm mới
    const newProduct = this.productRepository.create({
      ...createProductDto,
      category: category,
    });

    const result = await this.productRepository.save(newProduct);

    return result;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // 1. Tìm sản phẩm theo ID
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id}`);
    }

    // 3. Nếu có category_id, kiểm tra category tồn tại
    if (updateProductDto.category_id) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.category_id },
      });

      if (!category) {
        throw new NotFoundException(
          `Không tìm thấy danh mục với ID: ${updateProductDto.category_id}`,
        );
      }
    }
    // 4. Cập nhật thông tin sản phẩm
    Object.assign(product, updateProductDto);
    // 5. Lưu vào database
    const result = await this.productRepository.save(product);
    // 6. Trả về sản phẩm đã cập nhật

    return result;
  }

  async remove(id: string): Promise<void> {
    // 1. Tìm sản phẩm theo ID
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${id}`);
    }

    await this.productRepository.remove(product);
  }
}
