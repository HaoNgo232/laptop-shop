import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { CategoryDetailDto } from '@/products/dtos/category-detail.dto';
import { CategoryDto } from '@/products/dtos/category.dto';
import { CategoriesService } from '@/products/services/categories.service';
import { Controller, Get, Param } from '@nestjs/common';

@Auth(AuthType.None)
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<CategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryDetailDto> {
    return this.categoriesService.findOne(id);
  }
}
