import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { AuthType } from '../../auth/enums/auth-type.enum';
import { UserRole } from '../../auth/enums/user.role';
import { Auth } from '../../auth/decorators/auth.decorator';

@Controller('api/admin.products')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productsService.create(createProductDto) as Promise<ProductDto>;
  }

  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productsService.update(
      id,
      updateProductDto,
    ) as Promise<ProductDto>;
  }

  @Delete(':id')
  public remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
