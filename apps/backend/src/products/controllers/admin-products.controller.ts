import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { CreateProductDto } from '@/products/dtos/create-product.dto';
import { ProductDto } from '@/products/dtos/product.dto';
import { UpdateProductDto } from '@/products/dtos/update-product.dto';
import { ProductsService } from '@/products/services/products.service';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';

@Controller('api/admin/products')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(createProductDto) as Promise<ProductDto>;
  }

  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productsService.update(id, updateProductDto) as Promise<ProductDto>;
  }

  @Delete(':id')
  public remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
