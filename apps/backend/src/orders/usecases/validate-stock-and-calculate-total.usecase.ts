import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/products/entities/product.entity';
import { CartItem } from '@/cart/entities/cart-item.entity';
import { OrderItem } from '@/orders/entities/order-item.entity';

export interface StockValidationResult {
  orderItems: Pick<OrderItem, 'productId' | 'quantity' | 'priceAtPurchase'>[];
  totalAmount: number;
}

@Injectable()
export class ValidateStockAndCalculateTotalUseCase {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Validate stock và tính tổng tiền
   * Tuân thủ Single Responsibility Principle - chỉ lo validation stock và calculation
   */
  async execute(cartItems: CartItem[]): Promise<StockValidationResult> {
    let totalAmount = 0;
    const orderItems: Pick<OrderItem, 'productId' | 'quantity' | 'priceAtPurchase'>[] = [];

    for (const cartItem of cartItems) {
      // Validate quantity
      this.validateQuantity(cartItem.quantity);

      // Lấy và validate product
      const product = await this.getAndValidateProduct(cartItem.productId);

      // Validate stock availability
      this.validateStockAvailability(product, cartItem.quantity);

      // Validate price
      this.validatePrice(product.price);

      // Calculate item total
      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        priceAtPurchase: product.price,
      });
    }

    return { orderItems, totalAmount };
  }

  private validateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException(`Số lượng sản phẩm phải lớn hơn 0, nhận được: ${quantity}`);
    }
  }

  private async getAndValidateProduct(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException(`Sản phẩm với ID ${productId} không tồn tại`);
    }

    return product;
  }

  private validateStockAvailability(product: Product, requestedQuantity: number): void {
    if (product.stockQuantity < requestedQuantity) {
      throw new BadRequestException(
        `Sản phẩm "${product.name}" không đủ hàng. Còn lại: ${product.stockQuantity}, yêu cầu: ${requestedQuantity}`,
      );
    }
  }

  private validatePrice(price: number): void {
    if (price < 0) {
      throw new BadRequestException(`Giá sản phẩm không hợp lệ: ${price}`);
    }
  }
}
