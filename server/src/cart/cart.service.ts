import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartDto } from './dtos/cart.dto';
import { Product } from '@/products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Lấy cart của user theo userId và trả về DTO
   */
  async getCartByUserId(userId: string): Promise<CartDto> {
    const cart = await this.getCartEntityByUserId(userId);
    return this.mapCartToDto(cart);
  }

  /**
   * Lấy cart entity của user theo userId
   */
  async getCartEntityByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cart_items', 'cart_items.product'],
    });

    if (!cart) {
      // Tự động tạo cart mới nếu chưa có
      return await this.findOrCreateCart(userId);
    }

    return cart;
  }

  /**
   * Thêm sản phẩm vào cart
   */
  async addItemToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartDto> {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Tìm hoặc tạo cart
    const cart = await this.findOrCreateCart(userId);

    // Kiểm tra xem sản phẩm đã có trong cart chưa
    const existingCartItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (existingCartItem) {
      // Nếu đã có, cập nhật số lượng
      existingCartItem.quantity += quantity;
      await this.cartItemRepository.save(existingCartItem);
    } else {
      // Nếu chưa có, tạo mới
      const cartItem = this.cartItemRepository.create({
        cart_id: cart.id,
        product_id: productId,
        quantity: quantity,
        price_at_addition: product.price, // Lưu giá tại thời điểm thêm vào cart
      });
      await this.cartItemRepository.save(cartItem);
    }

    // Reload cart với relations và trả về DTO
    const updatedCart = await this.getCartEntityByUserId(userId);
    return this.mapCartToDto(updatedCart);
  }

  /**
   * Cập nhật số lượng sản phẩm trong cart
   */
  async updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartDto> {
    const cart = await this.getCartEntityByUserId(userId);

    const cartItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    const updatedCart = await this.getCartEntityByUserId(userId);
    return this.mapCartToDto(updatedCart);
  }

  /**
   * Xóa sản phẩm khỏi cart
   */
  async removeCartItem(userId: string, productId: string): Promise<CartDto> {
    const cart = await this.getCartEntityByUserId(userId);

    const cartItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
    }

    await this.cartItemRepository.remove(cartItem);

    const updatedCart = await this.getCartEntityByUserId(userId);
    return this.mapCartToDto(updatedCart);
  }

  /**
   * Xóa tất cả sản phẩm trong cart
   */
  async clearUserCart(userId: string): Promise<void> {
    const cart = await this.getCartEntityByUserId(userId);

    await this.cartItemRepository.delete({
      cart_id: cart.id,
    });
  }

  /**
   * Tìm hoặc tạo cart cho user
   */
  private async findOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cart_items', 'cart_items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: { id: userId },
      });
      cart = await this.cartRepository.save(cart);

      // Reload với relations
      const reloadedCart = await this.cartRepository.findOne({
        where: { id: cart.id },
        relations: ['cart_items', 'cart_items.product'],
      });

      if (!reloadedCart) {
        throw new Error('Không thể tạo cart cho user');
      }

      cart = reloadedCart;
    }

    return cart;
  }

  /**
   * Convert Cart entity sang CartDto
   */
  private mapCartToDto(cart: Cart): CartDto {
    return {
      id: cart.id,
      items:
        cart.cart_items?.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image_url: item.product.image_url ?? '',
          },
          quantity: item.quantity,
          price_at_addition: item.price_at_addition,
        })) || [],
      total_items:
        cart.cart_items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
      total_price:
        cart.cart_items?.reduce(
          (acc, item) => acc + item.price_at_addition * item.quantity,
          0,
        ) || 0,
    };
  }
}
