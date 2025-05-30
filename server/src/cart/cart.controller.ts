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
import { CartService } from './cart.service';
import { CartDto } from './dtos/cart.dto';
import { AddCartItemDto } from './dtos/add-cart-item.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../auth/enums/user-role';

@Controller('api/cart')
@Auth(AuthType.Bearer, UserRole.USER, UserRole.ADMIN)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Lấy giỏ hàng của user hiện tại
   */
  @Get()
  getCart(@CurrentUser('sub') userId: string): Promise<CartDto> {
    return this.cartService.getCartByUserId(userId);
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  @Post('items')
  addItem(
    @CurrentUser('sub') userId: string,
    @Body() addItemDto: AddCartItemDto,
  ): Promise<CartDto> {
    return this.cartService.addItemToCart(userId, addItemDto.productId, addItemDto.quantity);
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   */
  @Put('items/:productId')
  updateItem(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
    @Body() updateItemDto: UpdateCartItemDto,
  ): Promise<CartDto> {
    return this.cartService.updateCartItemQuantity(userId, productId, updateItemDto.quantity);
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  @Delete('items/:productId')
  removeItem(
    @CurrentUser('sub') userId: string,
    @Param('productId') productId: string,
  ): Promise<CartDto> {
    return this.cartService.removeCartItem(userId, productId);
  }

  /**
   * Xóa tất cả sản phẩm trong giỏ hàng
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  clearCart(@CurrentUser('sub') userId: string): Promise<void> {
    return this.cartService.clearUserCart(userId);
  }
}
