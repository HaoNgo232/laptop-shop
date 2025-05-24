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
import { CategoryMapperProvider } from '../providers/category-mapper.provider';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryMapper: CategoryMapperProvider,
  ) {}

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find({
      order: { created_at: 'DESC' },
    });

    return this.categoryMapper.toCategoriesToDtos(categories);
  }

  async findOne(id: string): Promise<CategoryDetailDto> {
    const category = await this.findCategoryByIdOrThrow(id);
    return this.categoryMapper.toCategoryDetailDto(category);
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    await this.validateCategoryNameNotExists(createCategoryDto.name);

    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);

    return this.categoryMapper.toCategoryDto(savedCategory);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.findCategoryByIdOrThrow(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      await this.validateCategoryNameNotExists(updateCategoryDto.name);
    }

    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);

    return this.categoryMapper.toCategoryDto(updatedCategory);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findCategoryByIdOrThrow(id);

    const hasProducts = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .where('category.id = :id', { id })
      .andWhere('product.id IS NOT NULL')
      .getCount();

    if (hasProducts > 0) {
      throw new ConflictException('Không thể xóa danh mục đang có sản phẩm');
    }

    await this.categoryRepository.remove(category);
  }

  private async findCategoryByIdOrThrow(id: string): Promise<Category> {
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
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException(`Danh mục với tên "${name}" đã tồn tại`);
    }
  }
}
