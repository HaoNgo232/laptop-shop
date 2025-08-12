import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { CreateProductDto } from '@/products/dtos/create-product.dto';
import { ProductDto } from '@/products/dtos/product.dto';
import { QueryProductDto } from '@/products/dtos/query-product.dto';
import { UpdateProductDto } from '@/products/dtos/update-product.dto';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';
import { ProductsService } from '@/products/services/products.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin - Sản phẩm')
@ApiBearerAuth('Authorization')
@Controller('api/admin/products')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm' })
  @ApiCreatedResponse({ description: 'Tạo sản phẩm thành công.' })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = await this.productsService.create(createProductDto);
    // Service sẽ return Product entity, controller không cần cast vì NestJS tự serialize
    return product as ProductDto;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiOkResponse({ description: 'Cập nhật sản phẩm thành công.' })
  @ApiParam({ name: 'id', description: 'ID sản phẩm' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    const product = await this.productsService.update(id, updateProductDto);
    return product as ProductDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa (soft delete) sản phẩm' })
  @ApiOkResponse({ description: 'Đã chuyển sản phẩm vào thùng rác.' })
  @ApiParam({ name: 'id', description: 'ID sản phẩm' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.productsService.remove(id);
    return { message: 'Sản phẩm đã được chuyển vào thùng rác.' };
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục sản phẩm đã xóa' })
  @ApiOkResponse({ description: 'Khôi phục sản phẩm thành công.' })
  @ApiParam({ name: 'id', description: 'ID sản phẩm' })
  async restore(@Param('id') id: string): Promise<ProductDto> {
    const product = await this.productsService.restore(id);
    return product as ProductDto;
  }
}
