import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from '@/products/services/products.service';
import { ProductDto } from '@/products/dtos/product.dto';
import { QueryProductDto } from '@/products/dtos/query-product.dto';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';
import { PaginatedResponseDto } from '@/common/dtos/paginated-response.dto';
import { ErrorResponseDto, NotFoundErrorResponseDto, ValidationErrorResponseDto } from '@/common/dtos/api-response.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiQuery, 
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiExtraModels
} from '@nestjs/swagger';

@ApiTags('🛍️ Products')
@ApiExtraModels(PaginatedResponseDto, ProductDto, ValidationErrorResponseDto, NotFoundErrorResponseDto, ErrorResponseDto)
@Controller('api/products')
@Auth(AuthType.None)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách sản phẩm',
    description: `
      Lấy danh sách sản phẩm với các tính năng:
      
      **Phân trang:**
      - page: Trang hiện tại (mặc định 1)
      - limit: Số sản phẩm mỗi trang (mặc định 12, tối đa 100)
      
      **Lọc:**
      - categoryId: Lọc theo danh mục cụ thể
      - priceMin/priceMax: Lọc theo khoảng giá
      - search: Tìm kiếm theo tên sản phẩm
      
      **Sắp xếp:**
      - sortBy: Trường sắp xếp (name, price, createdAt, averageRating, reviewCount)
      - sortOrder: Thứ tự sắp xếp (ASC, DESC)
      
      **Kết quả:** Danh sách sản phẩm với thông tin đầy đủ bao gồm đánh giá và tồn kho.
    `,
  })
  @ApiOkResponse({ 
    description: 'Danh sách sản phẩm được trả về thành công.',
    type: PaginatedResponseDto<ProductDto>
  })
  @ApiBadRequestResponse({ 
    description: 'Tham số truy vấn không hợp lệ (page, limit, categoryId, giá, v.v.).',
    type: ValidationErrorResponseDto
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi truy xuất danh sách sản phẩm.',
    type: ErrorResponseDto
  })
  public findAll(@Query() query: QueryProductDto): Promise<PaginatedResponse<ProductDto>> {
    return this.productsService.findAll(query);
  }

  @Get('high-stock')
  @ApiOperation({
    summary: 'Sản phẩm tồn kho cao',
    description: `
      Lấy danh sách sản phẩm có số lượng tồn kho cao nhất.
      
      **Ứng dụng:**
      - Hiển thị sản phẩm khuyến mãi
      - Tối ưu hóa doanh số cho sản phẩm tồn kho
      - Phân tích và quản lý kho hàng
      
      **Mặc định:** Trả về 8 sản phẩm có tồn kho cao nhất.
    `,
  })
  @ApiOkResponse({ 
    description: 'Danh sách sản phẩm tồn kho cao được trả về thành công.',
    type: [ProductDto]
  })
  @ApiBadRequestResponse({ 
    description: 'Tham số limit không hợp lệ.',
    type: ValidationErrorResponseDto
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Số lượng sản phẩm muốn lấy (mặc định 8, tối đa 50)',
    example: 8,
    schema: { type: 'integer', minimum: 1, maximum: 50 }
  })
  public findHighStockProducts(@Query('limit') limit?: number): Promise<ProductDto[]> {
    return this.productsService.findHighStockProducts(limit);
  }

  @Get('best-selling')
  @ApiOperation({
    summary: 'Sản phẩm bán chạy',
    description: `
      Lấy danh sách sản phẩm bán chạy nhất dựa trên số lượng đã bán.
      
      **Tiêu chí:** Sản phẩm được sắp xếp theo tổng số lượng đã bán giảm dần.
      
      **Ứng dụng:**
      - Trang chủ hiển thị sản phẩm nổi bật
      - Khuyến nghị sản phẩm cho khách hàng
      - Phân tích xu hướng bán hàng
      
      **Mặc định:** Trả về 8 sản phẩm bán chạy nhất.
    `,
  })
  @ApiOkResponse({ 
    description: 'Danh sách sản phẩm bán chạy được trả về thành công.',
    type: [ProductDto]
  })
  @ApiBadRequestResponse({ 
    description: 'Tham số limit không hợp lệ.',
    type: ValidationErrorResponseDto
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Số lượng sản phẩm muốn lấy (mặc định 8, tối đa 50)',
    example: 8,
    schema: { type: 'integer', minimum: 1, maximum: 50 }
  })
  public findBestSellingProducts(@Query('limit') limit?: number): Promise<ProductDto[]> {
    return this.productsService.findBestSellingProducts(limit);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Chi tiết sản phẩm',
    description: `
      Lấy thông tin chi tiết của một sản phẩm cụ thể.
      
      **Thông tin bao gồm:**
      - Thông tin cơ bản (tên, mô tả, giá, hình ảnh)
      - Thông tin kho hàng (tồn kho, số lượng đặt trước)
      - Đánh giá (điểm trung bình, số lượng đánh giá)
      - Thông tin danh mục
      - Timestamps (tạo, cập nhật)
      
      **Lưu ý:** Chỉ trả về sản phẩm đang hoạt động (active = true).
    `
  })
  @ApiOkResponse({ 
    description: 'Thông tin chi tiết sản phẩm được trả về thành công.',
    type: ProductDto
  })
  @ApiBadRequestResponse({ 
    description: 'ID sản phẩm không đúng định dạng UUID.',
    type: ValidationErrorResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Không tìm thấy sản phẩm với ID được cung cấp hoặc sản phẩm đã bị xóa.',
    type: NotFoundErrorResponseDto
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi truy xuất thông tin sản phẩm.',
    type: ErrorResponseDto
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID của sản phẩm cần xem chi tiết',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductDto> {
    return this.productsService.findOne(id);
  }
}
