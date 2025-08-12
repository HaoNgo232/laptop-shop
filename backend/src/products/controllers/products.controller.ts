import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '@/products/services/products.service';
import { ProductDto } from '@/products/dtos/product.dto';
import { QueryProductDto } from '@/products/dtos/query-product.dto';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Sản phẩm')
@Controller('api/products')
@Auth(AuthType.None)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách sản phẩm',
    description: 'Lấy danh sách sản phẩm với phân trang và lọc.',
  })
  @ApiOkResponse({ description: 'Danh sách sản phẩm.' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số phần tử mỗi trang' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Lọc theo danh mục' })
  @ApiQuery({ name: 'q', required: false, description: 'Từ khóa tìm kiếm theo tên' })
  public findAll(@Query() query: QueryProductDto): Promise<PaginatedResponse<ProductDto>> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  @ApiOkResponse({ description: 'Thông tin chi tiết sản phẩm.' })
  @ApiParam({ name: 'id', description: 'ID sản phẩm' })
  public findOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productsService.findOne(id);
  }
}
