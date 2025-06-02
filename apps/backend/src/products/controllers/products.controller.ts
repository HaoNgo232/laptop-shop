import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductDto } from '../dtos/product.dto';
import { ProductDetailDto } from '../dtos/product-detail.dto';
import { QueryProductDto } from '../dtos/query-product.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';
import { AuthType } from '../../auth/enums/auth-type.enum';
import { Auth } from '../../auth/decorators/auth.decorator';

@Auth(AuthType.None)
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  public findAll(
    @Query() query: QueryProductDto,
  ): Promise<PaginatedResponse<ProductDto>> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<ProductDetailDto> {
    return this.productsService.findOne(id);
  }
}
