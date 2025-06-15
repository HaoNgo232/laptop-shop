import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { CreateProductDto } from '@/products/dtos/create-product.dto';
import { ProductDto } from '@/products/dtos/product.dto';
import { UpdateProductDto } from '@/products/dtos/update-product.dto';
import { QueryProductDto } from '@/products/dtos/query-product.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { ProductsService } from '@/products/services/products.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Products')
@ApiBearerAuth()
@Controller('api/admin/products')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm cho admin (bao gồm cả soft deleted)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách sản phẩm được lấy thành công.',
    type: [ProductDto],
  })
  async findAll(@Query() query: QueryProductDto): Promise<PaginatedResponse<ProductDto>> {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm theo ID cho admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chi tiết sản phẩm được lấy thành công.',
    type: ProductDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy sản phẩm.' })
  async findOne(@Param('id') id: string): Promise<ProductDto> {
    return await this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sản phẩm được tạo thành công.',
    type: ProductDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dữ liệu đầu vào không hợp lệ.' })
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = await this.productsService.create(createProductDto);
    // Service sẽ return Product entity, controller không cần cast vì NestJS tự serialize
    return product as ProductDto;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sản phẩm được cập nhật thành công.',
    type: ProductDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy sản phẩm.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dữ liệu đầu vào không hợp lệ.' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    const product = await this.productsService.update(id, updateProductDto);
    return product as ProductDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xoá mềm sản phẩm (chuyển vào thùng rác)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sản phẩm đã được chuyển vào thùng rác.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy sản phẩm.' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.productsService.remove(id);
    return { message: 'Sản phẩm đã được chuyển vào thùng rác.' };
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục sản phẩm từ thùng rác' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sản phẩm được khôi phục thành công.',
    type: ProductDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy sản phẩm hoặc sản phẩm không ở trong thùng rác.',
  })
  async restore(@Param('id') id: string): Promise<ProductDto> {
    const product = await this.productsService.restore(id);
    return product as ProductDto;
  }
}
