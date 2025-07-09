import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '@/products/services/products.service';
import { ProductDto } from '@/products/dtos/product.dto';
import { QueryProductDto } from '@/products/dtos/query-product.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';

@Controller('api/products')
@Auth(AuthType.None)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  public findAll(@Query() query: QueryProductDto): Promise<PaginatedResponse<ProductDto>> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productsService.findOne(id);
  }
}
