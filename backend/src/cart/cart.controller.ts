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
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Giỏ hàng')
@ApiBearerAuth('Authorization')
@Controller('api/cart')
@Auth(AuthType.Bearer, UserRole.USER, UserRole.ADMIN)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Lấy giỏ hàng của user hiện tại
   */
  @Get()
  @ApiOperation({ summary: 'Lấy giỏ hàng hiện tại' })
  @ApiOkResponse({ description: 'Thông tin giỏ hàng của người dùng.' })
  getCart(@CurrentUser('sub') userId: string): Promise<CartDto> {
    return this.cartService.findOne(userId);
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  @Post('items')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ' })
  @ApiOkResponse({ description: 'Giỏ hàng sau khi thêm sản phẩm.' })
  addItem(@CurrentUser('sub') userId: string, @Body() addItemDto: AddToCartDto): Promise<CartDto> {
    return this.cartService.addItem(userId, addItemDto.productId, addItemDto.quantity);
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   */
  @Put('items/:productId')
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm' })
  @ApiOkResponse({ description: 'Giỏ hàng sau khi cập nhật.' })
  @ApiParam({ name: 'productId', description: 'ID sản phẩm' })
  updateItem(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
    @Body() updateItemDto: UpdateCartItemDto,
  ): Promise<CartDto> {
    return this.cartService.updateQuantity(userId, productId, updateItemDto.quantity);
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  @Delete('items/:productId')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ' })
  @ApiOkResponse({ description: 'Giỏ hàng sau khi xóa sản phẩm.' })
  @ApiParam({ name: 'productId', description: 'ID sản phẩm' })
  removeItem(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
  ): Promise<CartDto> {
    return this.cartService.removeItem(userId, productId);
  }

  /**
   * Xóa tất cả sản phẩm trong giỏ hàng
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa toàn bộ giỏ hàng' })
  @ApiNoContentResponse({ description: 'Đã xóa toàn bộ giỏ hàng.' })
  clearCart(@CurrentUser('sub') userId: string): Promise<void> {
    return this.cartService.clear(userId);
  }
}
