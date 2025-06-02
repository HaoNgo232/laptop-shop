import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryDto } from '../dtos/category.dto';
import { AuthType } from '../../auth/enums/auth-type.enum';
import { UserRole } from '../../auth/enums/user-role';
import { Auth } from '../../auth/decorators/auth.decorator';

@Controller('api/admin.categories')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    // Gọi service để tạo danh mục mới
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    // Gọi service để cập nhật danh mục
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    // Gọi service để xóa danh mục
    return this.categoriesService.remove(id);
  }
}
