import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryDto } from '../dtos/category.dto';
import { CategoryDetailDto } from '../dtos/category-detail.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<CategoryDto[]> {
    // Logic chính:
    // 1. Lấy tất cả danh mục từ database
    // 2. Map dữ liệu sang CategoryDto
    // 3. Trả về danh sách CategoryDto

    return [];
  }

  async findOne(id: string): Promise<CategoryDetailDto> {
    // Logic chính:
    // 1. Tìm danh mục theo ID với relations đến products
    // 2. Kiểm tra nếu không tìm thấy, throw NotFoundException
    // 3. Map dữ liệu sang CategoryDetailDto
    // 4. Trả về đối tượng CategoryDetailDto

    return {} as CategoryDetailDto;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Logic chính:
    // 1. Kiểm tra xem tên danh mục đã tồn tại chưa
    // 2. Nếu tồn tại, throw ConflictException
    // 3. Tạo đối tượng danh mục mới
    // 4. Lưu vào database
    // 5. Trả về danh mục đã tạo

    return {} as Category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // Logic chính:
    // 1. Tìm danh mục theo ID
    // 2. Kiểm tra nếu không tìm thấy, throw NotFoundException
    // 3. Nếu cập nhật tên, kiểm tra tên mới đã tồn tại chưa
    // 4. Cập nhật thông tin danh mục
    // 5. Lưu vào database
    // 6. Trả về danh mục đã cập nhật

    return {} as Category;
  }

  async remove(id: string): Promise<void> {
    // Logic chính:
    // 1. Tìm danh mục theo ID
    // 2. Kiểm tra nếu không tìm thấy, throw NotFoundException
    // 3. Kiểm tra xem danh mục có sản phẩm không
    // 4. Xóa danh mục
  }
}
