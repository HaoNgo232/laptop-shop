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

  @Get('high-stock')
  @ApiOperation({
    summary: 'Sản phẩm tồn kho cao',
    description: 'Lấy danh sách sản phẩm có tồn kho cao nhất (cho khuyến mãi).',
  })
  @ApiOkResponse({ description: 'Danh sách sản phẩm tồn kho cao.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng sản phẩm (mặc định 8)' })
  public findHighStockProducts(@Query('limit') limit?: number): Promise<ProductDto[]> {
    return this.productsService.findHighStockProducts(limit);
  }

  @Get('best-selling')
  @ApiOperation({
    summary: 'Sản phẩm bán chạy',
    description: 'Lấy danh sách sản phẩm bán chạy nhất dựa trên số lượng đã bán.',
  })
  @ApiOkResponse({ description: 'Danh sách sản phẩm bán chạy.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng sản phẩm (mặc định 8)' })
  public findBestSellingProducts(@Query('limit') limit?: number): Promise<ProductDto[]> {
    return this.productsService.findBestSellingProducts(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  @ApiOkResponse({ description: 'Thông tin chi tiết sản phẩm.' })
  @ApiParam({ name: 'id', description: 'ID sản phẩm' })
  public findOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productsService.findOne(id);
  }
}
