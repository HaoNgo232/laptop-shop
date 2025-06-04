import { Auth } from '@/auth/decorators/auth.decorator';
import { ProductDetailDto } from '@/products/dtos/product-detail.dto';
import { ProductDto } from '@/products/dtos/product.dto';
import { QueryProductDto } from '@/products/dtos/query-product.dto';
import { ProductsService } from '@/products/services/products.service';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { Controller, Get, Param, Query } from '@nestjs/common';

@Auth(AuthType.None)
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  public findAll(@Query() query: QueryProductDto): Promise<PaginatedResponse<ProductDto>> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<ProductDetailDto> {
    return this.productsService.findOne(id);
  }
}
