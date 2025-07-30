import { CartDto } from '@/cart/dtos/cart.dto';
import { CartItem } from '@/cart/entities/cart-item.entity';
import { Cart } from '@/cart/entities/cart.entity';
import { Product } from '@/products/entities/product.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface CartService {
  findOne(userId: string): Promise<CartDto>;
  findCart(userId: string): Promise<Cart>;
  addItem(userId: string, productId: string, quantity: number): Promise<CartDto>;
  updateQuantity(userId: string, productId: string, quantity: number): Promise<CartDto>;
  removeItem(userId: string, productId: string): Promise<CartDto>;
  clear(userId: string): Promise<void>;
}

@Injectable()
export class CartService implements CartService {
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
  async findOne(userId: string): Promise<CartDto> {
    const cart = await this.findCart(userId);
    return this.mapCartToDto(cart);
  }

  /**
   * Lấy cart  của user theo userId
   */
  async findCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product', 'cartItems.product.category'],
    });

    if (!cart) {
      // Tự động tạo cart mới nếu chưa có
      return await this.findOrCreate(userId);
    }

    return cart;
  }

  /**
   * Thêm sản phẩm vào cart
   */
  async addItem(userId: string, productId: string, quantity: number): Promise<CartDto> {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Tìm hoặc tạo cart
    const cart = await this.findOrCreate(userId);

    // Kiểm tra xem sản phẩm đã có trong cart chưa
    const existingCartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId: productId },
    });

    if (existingCartItem) {
      // Nếu đã có, cập nhật số lượng
      existingCartItem.quantity += quantity;
      await this.cartItemRepository.save(existingCartItem);
    } else {
      // Nếu chưa có, tạo mới
      const cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
        priceAtAddition: product.price, // Lưu giá tại thời điểm thêm vào cart
      });
      await this.cartItemRepository.save(cartItem);
    }

    // Reload cart với relations và trả về DTO
    const updatedCart = await this.findCart(userId);
    return this.mapCartToDto(updatedCart);
  }

  /**
   * Cập nhật số lượng sản phẩm trong cart
   */
  async updateQuantity(userId: string, productId: string, quantity: number): Promise<CartDto> {
    const cart = await this.findCart(userId);

    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId: productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    const updatedCart = await this.findCart(userId);
    return this.mapCartToDto(updatedCart);
  }

  /**
   * Xóa sản phẩm khỏi cart
   */
  async removeItem(userId: string, productId: string): Promise<CartDto> {
    const cart = await this.findCart(userId);

    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId: productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
    }

    await this.cartItemRepository.remove(cartItem);

    const updatedCart = await this.findCart(userId);
    return this.mapCartToDto(updatedCart);
  }

  /**
   * Xóa tất cả sản phẩm trong cart
   */
  async clear(userId: string): Promise<void> {
    const cart = await this.findCart(userId);

    await this.cartItemRepository.delete({
      cartId: cart.id,
    });
  }

  /**
   * Tìm hoặc tạo cart cho user
   */
  private async findOrCreate(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product', 'cartItems.product.category'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user: { id: userId },
      });
      cart = await this.cartRepository.save(cart);

      // Reload với relations
      const reloadedCart = await this.cartRepository.findOne({
        where: { id: cart.id },
        relations: ['cartItems', 'cartItems.product', 'cartItems.product.category'],
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
        cart.cartItems?.map((item) => ({
          id: item.productId,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.imageUrl ?? '',
            category: {
              id: item.product.category.id,
              name: item.product.category.name,
            },
          },
          quantity: item.quantity,
          priceAtAddition: item.priceAtAddition,
        })) || [],
      totalItems: cart.cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0,
      totalPrice:
        cart.cartItems?.reduce((acc, item) => acc + item.priceAtAddition * item.quantity, 0) || 0,
    };
  }
}
