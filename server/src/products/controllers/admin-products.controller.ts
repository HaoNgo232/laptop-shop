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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Quản lý sản phẩm')
@ApiBearerAuth()
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  @ApiResponse({
    status: 201,
    description: 'Sản phẩm đã được tạo thành công',
    type: ProductDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    // Gọi service để tạo sản phẩm mới
    return this.productsService.create(createProductDto) as Promise<ProductDto>;
  }

  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Sản phẩm đã được cập nhật thành công',
    type: ProductDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    // Gọi service để cập nhật sản phẩm
    return this.productsService.update(
      id,
      updateProductDto,
    ) as Promise<ProductDto>;
  }

  @ApiOperation({ summary: 'Xóa sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Sản phẩm đã được xóa thành công',
  })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    // Gọi service để xóa sản phẩm
    return this.productsService.remove(id);
  }
}
