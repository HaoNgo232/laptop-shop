import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CategoryDto } from '../dtos/category.dto';
import { CategoryDetailDto } from '../dtos/category-detail.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Danh mục sản phẩm')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Lấy danh sách tất cả danh mục' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách danh mục đã được lấy thành công',
    type: CategoryDto,
    isArray: true,
  })
  @Get()
  findAll(): Promise<CategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Lấy chi tiết một danh mục và các sản phẩm thuộc danh mục đó',
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết danh mục đã được lấy thành công',
    type: CategoryDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryDetailDto> {
    return this.categoriesService.findOne(id);
  }
}
