import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ProductDto } from '../dtos/product.dto';
import { ProductDetailDto } from '../dtos/product-detail.dto';
import { QueryProductDto } from '../dtos/query-product.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthType } from '../../auth/enums/auth-type.enum';
import { Auth } from '../../auth/decorators/auth.decorator';

@ApiTags('Sản phẩm')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm có phân trang, lọc và sắp xếp',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách sản phẩm đã được lấy thành công',
    type: ProductDto,
    isArray: true,
  })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng sản phẩm trên mỗi trang',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'ID của danh mục để lọc sản phẩm',
  })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Trường sắp xếp' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Thứ tự sắp xếp',
  })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Giá tối thiểu' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Giá tối đa' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Tìm kiếm theo tên sản phẩm',
  })
  @Auth(AuthType.None)
  @Get()
  findAll(
    @Query() query: QueryProductDto,
  ): Promise<PaginatedResponse<ProductDto>> {
    return this.productsService.findAll(query);
  }

  @ApiOperation({ summary: 'Lấy chi tiết một sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết sản phẩm đã được lấy thành công',
    type: ProductDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductDetailDto> {
    return this.productsService.findOne(id);
  }
}
