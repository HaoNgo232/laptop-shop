import { ProductsProvider } from './../providers/produsts.provider';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { QueryProductDto, SortOrder } from '../dtos/query-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { ProductDetailDto } from '../dtos/product-detail.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';
import { PaginationMeta } from '../interfaces/pagination-meta.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly productsProvider: ProductsProvider,
  ) {}

  async findAll(
    queryDto: QueryProductDto,
  ): Promise<PaginatedResponse<ProductDto>> {
    return this.productsProvider.findAllProducts(queryDto);
  }

  async findOne(id: string): Promise<ProductDetailDto> {
    // Logic chính:
    // 1. Tìm sản phẩm theo ID với relations đến category
    // 2. Kiểm tra nếu không tìm thấy, throw NotFoundException
    // 3. Map dữ liệu sang ProductDetailDto
    // 4. Trả về đối tượng ProductDetailDto

    return {} as ProductDetailDto;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Logic chính:
    // 1. Kiểm tra category tồn tại
    // 2. Tạo đối tượng sản phẩm mới
    // 3. Lưu vào database
    // 4. Trả về sản phẩm đã tạo

    return {} as Product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Logic chính:
    // 1. Tìm sản phẩm theo ID
    // 2. Kiểm tra nếu không tìm thấy, throw NotFoundException
    // 3. Nếu có category_id, kiểm tra category tồn tại
    // 4. Cập nhật thông tin sản phẩm
    // 5. Lưu vào database
    // 6. Trả về sản phẩm đã cập nhật

    return {} as Product;
  }

  async remove(id: string): Promise<void> {
    // Logic chính:
    // 1. Tìm sản phẩm theo ID
    // 2. Kiểm tra nếu không tìm thấy, throw NotFoundException
    // 3. Xóa sản phẩm
  }
}
