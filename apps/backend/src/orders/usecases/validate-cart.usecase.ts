import { Injectable, BadRequestException } from '@nestjs/common';
import { CartService } from '@/cart/cart.service';
import { Cart } from '@/cart/entities/cart.entity';

@Injectable()
export class ValidateCartUseCase {
  constructor(private readonly cartService: CartService) {}

  /**
   * Validate và lấy cart của user
   * Tuân thủ Single Responsibility Principle - chỉ lo validation cart
   */
  async execute(userId: string): Promise<Cart> {
    const cart = await this.cartService.findOneEntity(userId);

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Giỏ hàng trống, không thể tạo đơn hàng');
    }

    return cart;
  }
}
