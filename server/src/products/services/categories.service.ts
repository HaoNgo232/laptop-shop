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
    const categories = await this.categoryRepository.find();

    const categoryDtos = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
    }));

    // 3. Trả về danh sách CategoryDto
    return categoryDtos;
  }

  async findOne(id: string): Promise<CategoryDetailDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    // 2. Kiểm tra nếu không tìm thấy, throw NotFoundException
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Danh mục với tên "${createCategoryDto.name}" đã tồn tại`,
      );
    }

    const newCategory = this.categoryRepository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    });

    return await this.categoryRepository.save(newCategory);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Danh mục với tên "${updateCategoryDto.name}" đã tồn tại`,
        );
      }
    }

    Object.assign(category, updateCategoryDto);

    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }

    if (category.products && category.products.length > 0) {
      throw new ConflictException(
        `Không thể xóa danh mục "${category.name}" vì còn ${category.products.length} sản phẩm thuộc danh mục này`,
      );
    }

    await this.categoryRepository.remove(category);
  }
}
