import { CategoryDetailDto } from '@/products/dtos/category-detail.dto';
import { CategoryDto } from '@/products/dtos/category.dto';
import { CreateCategoryDto } from '@/products/dtos/create-category.dto';
import { UpdateCategoryDto } from '@/products/dtos/update-category.dto';
import { Category } from '@/products/entities/category.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<CategoryDto[]> {
    // Lấy tất cả categories và sắp xếp theo thời gian tạo mới nhất
    const categories = await this.categoryRepository.find({
      order: { createdAt: 'DESC' },
    });

    return categories;
  }

  async findOne(id: string): Promise<CategoryDetailDto> {
    // Tìm category theo ID, throw error nếu không tồn tại
    const category = await this.findCategoryByIdOrThrow(id);
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    // Kiểm tra tên danh mục đã tồn tại chưa trước khi tạo
    await this.validateCategoryNameNotExists(createCategoryDto.name);

    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);

    return savedCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.findCategoryByIdOrThrow(id);

    // Chỉ validate tên mới nếu tên được thay đổi và khác với tên hiện tại
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      await this.validateCategoryNameNotExists(updateCategoryDto.name);
    }

    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);

    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const category = await this.findCategoryByIdOrThrow(id);

    // Kiểm tra xem danh mục có sản phẩm nào không bằng cách join với bảng products
    const hasProducts = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .where('category.id = :id', { id })
      .andWhere('product.id IS NOT NULL') // Chỉ đếm những category có ít nhất 1 product
      .getCount();

    if (hasProducts > 0) {
      throw new ConflictException('Không thể xóa danh mục đang có sản phẩm');
    }

    await this.categoryRepository.remove(category);
  }

  private async findCategoryByIdOrThrow(id: string): Promise<Category> {
    // Load category cùng với relations products để kiểm tra
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }

    return category;
  }

  private async validateCategoryNameNotExists(name: string): Promise<void> {
    // Kiểm tra tên danh mục đã tồn tại trong database chưa
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException(`Danh mục với tên "${name}" đã tồn tại`);
    }
  }
}
