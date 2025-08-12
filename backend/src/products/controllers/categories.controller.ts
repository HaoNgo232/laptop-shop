import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { CategoryDetailDto } from '@/products/dtos/category-detail.dto';
import { CategoryDto } from '@/products/dtos/category.dto';
import { CategoriesService } from '@/products/services/categories.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Danh mục')
@Auth(AuthType.None)
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách danh mục' })
  @ApiOkResponse({ description: 'Trả về danh sách danh mục.' })
  findAll(): Promise<CategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết danh mục' })
  @ApiOkResponse({ description: 'Trả về thông tin chi tiết danh mục.' })
  @ApiParam({ name: 'id', description: 'ID danh mục' })
  findOne(@Param('id') id: string): Promise<CategoryDetailDto> {
    return this.categoriesService.findOne(id);
  }
}
