import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { CartDto } from '@/cart/dtos/cart.dto';
import { CartService } from '@/cart/cart.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AddToCartDto } from '@/cart/dtos/add-to-cart.dto';
import { UpdateCartItemDto } from '@/cart/dtos/update-cart-item.dto';
import { 
  ValidationErrorResponseDto, 
  UnauthorizedErrorResponseDto, 
  NotFoundErrorResponseDto,
  ErrorResponseDto 
} from '@/common/dtos/api-response.dto';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('🛒 Shopping Cart')
@ApiExtraModels(CartDto, AddToCartDto, UpdateCartItemDto, ValidationErrorResponseDto, UnauthorizedErrorResponseDto, NotFoundErrorResponseDto, ErrorResponseDto)
@ApiBearerAuth('Authorization')
@Controller('api/cart')
@Auth(AuthType.Bearer, UserRole.USER, UserRole.ADMIN)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Lấy giỏ hàng của user hiện tại
   */
  @Get()
  @ApiOperation({ 
    summary: 'Lấy giỏ hàng hiện tại',
    description: `
      Lấy thông tin giỏ hàng của người dùng đã đăng nhập.
      
      **Bao gồm:**
      - Danh sách tất cả sản phẩm trong giỏ
      - Thông tin chi tiết từng sản phẩm (tên, giá, hình ảnh)
      - Số lượng từng sản phẩm
      - Tổng số lượng và tổng giá trị giỏ hàng
      
      **Lưu ý:** Giá hiển thị là giá khi thêm vào giỏ, có thể khác giá hiện tại.
    `
  })
  @ApiOkResponse({ 
    description: 'Thông tin giỏ hàng được trả về thành công.',
    type: CartDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi truy xuất giỏ hàng.',
    type: ErrorResponseDto 
  })
  getCart(@CurrentUser('sub') userId: string): Promise<CartDto> {
    return this.cartService.findOne(userId);
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  @Post('items')
  @ApiOperation({ 
    summary: 'Thêm sản phẩm vào giỏ',
    description: `
      Thêm sản phẩm mới vào giỏ hàng hoặc tăng số lượng nếu đã có.
      
      **Quy trình:**
      1. Kiểm tra sản phẩm có tồn tại và đang hoạt động
      2. Kiểm tra tồn kho đủ không
      3. Nếu sản phẩm đã có trong giỏ: cộng thêm số lượng
      4. Nếu chưa có: thêm mới với giá hiện tại
      
      **Giới hạn:** Tối đa 100 sản phẩm cùng loại trong giỏ.
    `
  })
  @ApiOkResponse({ 
    description: 'Sản phẩm đã được thêm vào giỏ hàng thành công.',
    type: CartDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Dữ liệu không hợp lệ (productId sai định dạng, quantity không hợp lệ) hoặc không đủ tồn kho.',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Không tìm thấy sản phẩm với ID được cung cấp.',
    type: NotFoundErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi thêm sản phẩm vào giỏ.',
    type: ErrorResponseDto 
  })
  addItem(@CurrentUser('sub') userId: string, @Body() addItemDto: AddToCartDto): Promise<CartDto> {
    return this.cartService.addItem(userId, addItemDto.productId, addItemDto.quantity);
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   */
  @Put('items/:productId')
  @ApiOperation({ 
    summary: 'Cập nhật số lượng sản phẩm',
    description: `
      Cập nhật số lượng của một sản phẩm cụ thể trong giỏ hàng.
      
      **Quy trình:**
      1. Kiểm tra sản phẩm có trong giỏ hàng không
      2. Kiểm tra tồn kho đủ cho số lượng mới
      3. Cập nhật số lượng mới
      4. Tính lại tổng giá trị giỏ hàng
      
      **Lưu ý:** Để xóa sản phẩm, sử dụng endpoint DELETE thay vì set quantity = 0.
    `
  })
  @ApiOkResponse({ 
    description: 'Số lượng sản phẩm đã được cập nhật thành công.',
    type: CartDto 
  })
  @ApiBadRequestResponse({ 
    description: 'ProductId không hợp lệ, quantity không hợp lệ, hoặc không đủ tồn kho.',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Không tìm thấy sản phẩm trong giỏ hàng của người dùng.',
    type: NotFoundErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi cập nhật giỏ hàng.',
    type: ErrorResponseDto 
  })
  @ApiParam({ 
    name: 'productId', 
    description: 'ID của sản phẩm cần cập nhật số lượng',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  updateItem(
    @CurrentUser('sub') userId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() updateItemDto: UpdateCartItemDto,
  ): Promise<CartDto> {
    return this.cartService.updateQuantity(userId, productId, updateItemDto.quantity);
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  @Delete('items/:productId')
  @ApiOperation({ 
    summary: 'Xóa sản phẩm khỏi giỏ',
    description: `
      Xóa hoàn toàn một sản phẩm khỏi giỏ hàng.
      
      **Quy trình:**
      1. Kiểm tra sản phẩm có trong giỏ hàng không
      2. Xóa sản phẩm khỏi giỏ hàng
      3. Tính lại tổng số lượng và tổng giá trị
      
      **Kết quả:** Giỏ hàng sau khi đã xóa sản phẩm.
    `
  })
  @ApiOkResponse({ 
    description: 'Sản phẩm đã được xóa khỏi giỏ hàng thành công.',
    type: CartDto 
  })
  @ApiBadRequestResponse({ 
    description: 'ProductId không đúng định dạng UUID.',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Không tìm thấy sản phẩm trong giỏ hàng của người dùng.',
    type: NotFoundErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi xóa sản phẩm khỏi giỏ.',
    type: ErrorResponseDto 
  })
  @ApiParam({ 
    name: 'productId', 
    description: 'ID của sản phẩm cần xóa khỏi giỏ hàng',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  removeItem(
    @CurrentUser('sub') userId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<CartDto> {
    return this.cartService.removeItem(userId, productId);
  }

  /**
   * Xóa tất cả sản phẩm trong giỏ hàng
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Xóa toàn bộ giỏ hàng',
    description: `
      Xóa tất cả sản phẩm khỏi giỏ hàng của người dùng.
      
      **Sử dụng khi:**
      - Người dùng muốn bắt đầu mua sắm từ đầu
      - Sau khi đặt hàng thành công (tự động)
      - Hủy bỏ toàn bộ giỏ hàng
      
      **Kết quả:** Giỏ hàng trống (totalItems = 0, totalPrice = 0).
    `
  })
  @ApiNoContentResponse({ 
    description: 'Đã xóa toàn bộ giỏ hàng thành công.' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi xóa giỏ hàng.',
    type: ErrorResponseDto 
  })
  clearCart(@CurrentUser('sub') userId: string): Promise<void> {
    return this.cartService.clear(userId);
  }
}
