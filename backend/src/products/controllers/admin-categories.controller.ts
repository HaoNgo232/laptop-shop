import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { CategoryDto } from '@/products/dtos/category.dto';
import { CreateCategoryDto } from '@/products/dtos/create-category.dto';
import { UpdateCategoryDto } from '@/products/dtos/update-category.dto';
import { CategoriesService } from '@/products/services/categories.service';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('👨‍💼 Admin - Categories')
@ApiExtraModels(CategoryDto, CreateCategoryDto, UpdateCategoryDto)
@ApiBearerAuth('Authorization')
@Controller('api/admin/categories')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo danh mục' })
  @ApiCreatedResponse({ description: 'Tạo danh mục thành công.' })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    // Gọi service để tạo danh mục mới
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  @ApiOkResponse({ description: 'Cập nhật danh mục thành công.' })
  @ApiParam({ name: 'id', description: 'ID danh mục' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    // Gọi service để cập nhật danh mục
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa danh mục' })
  @ApiOkResponse({ description: 'Xóa danh mục thành công.' })
  @ApiParam({ name: 'id', description: 'ID danh mục' })
  remove(@Param('id') id: string): Promise<void> {
    // Gọi service để xóa danh mục
    return this.categoriesService.remove(id);
  }
}
