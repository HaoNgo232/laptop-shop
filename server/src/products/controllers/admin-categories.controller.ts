import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryDto } from '../dtos/category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Quản lý danh mục')
@ApiBearerAuth()
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Tạo danh mục mới' })
  @ApiResponse({
    status: 201,
    description: 'Danh mục đã được tạo thành công',
    type: CategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 409, description: 'Tên danh mục đã tồn tại' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    // Gọi service để tạo danh mục mới
    return this.categoriesService.create(
      createCategoryDto,
    ) as Promise<CategoryDto>;
  }

  @ApiOperation({ summary: 'Cập nhật thông tin danh mục' })
  @ApiResponse({
    status: 200,
    description: 'Danh mục đã được cập nhật thành công',
    type: CategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  @ApiResponse({ status: 409, description: 'Tên danh mục đã tồn tại' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    // Gọi service để cập nhật danh mục
    return this.categoriesService.update(
      id,
      updateCategoryDto,
    ) as Promise<CategoryDto>;
  }

  @ApiOperation({ summary: 'Xóa danh mục' })
  @ApiResponse({
    status: 200,
    description: 'Danh mục đã được xóa thành công',
  })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  @ApiResponse({
    status: 400,
    description: 'Không thể xóa danh mục có sản phẩm',
  })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    // Gọi service để xóa danh mục
    return this.categoriesService.remove(id);
  }
}
