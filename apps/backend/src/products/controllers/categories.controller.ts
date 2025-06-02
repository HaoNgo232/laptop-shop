import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CategoryDto } from '../dtos/category.dto';
import { CategoryDetailDto } from '../dtos/category-detail.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthType } from '../../auth/enums/auth-type.enum';

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
