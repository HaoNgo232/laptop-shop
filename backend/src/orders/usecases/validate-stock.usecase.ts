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
export class ValidateStockUseCase {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Kiểm tra số lượng sản phẩm có đủ không và tính tổng tiền (chưa áp dụng discount)
   */
  async execute(cartItems: CartItem[]): Promise<StockValidationResult> {
    let totalAmount = 0;
    const orderItems: Pick<OrderItem, 'productId' | 'quantity' | 'priceAtPurchase'>[] = [];

    // Lấy từng sản phẩm trong cart và xử lý
    for (const cartItem of cartItems) {
      // Kiểm tra số lượng sản phẩm có lớn hơn 0 hay không
      this.checkQuantity(cartItem.quantity);

      // Lấy product từ database
      const product = await this.getProduct(cartItem.productId);

      // Kiểm tra số lượng sản phẩm có đủ không
      this.checkStock(product, cartItem.quantity);

      // Kiểm tra giá sản phẩm có lớn hơn 0 hay không
      this.checkPrice(product.price);

      // Tính tổng tiền của từng loại sản phẩm theo số lượng
      const itemTotal = product.price * cartItem.quantity;

      // Cập nhật tổng tiền
      totalAmount += itemTotal;

      // Thêm sản phẩm vào danh sách đơn hàng
      orderItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        priceAtPurchase: product.price,
      });
    }

    return { orderItems, totalAmount };
  }

  /**
   * Kiểm tra số lượng sản phẩm
   */
  private checkQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException(`Số lượng sản phẩm phải lớn hơn 0, nhận được: ${quantity}`);
    }
  }

  /**
   * Lấy product từ database
   */
  private async getProduct(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException(`Sản phẩm với ID ${productId} không tồn tại`);
    }

    return product;
  }

  /**
   * Kiểm tra số lượng sản phẩm có đủ không
   */
  private checkStock(product: Product, requestedQuantity: number): void {
    // Nếu số lượng trong kho < số lượng yêu cầu
    if (product.stockQuantity < requestedQuantity) {
      throw new BadRequestException(
        `Sản phẩm "${product.name}" không đủ hàng. Còn lại: ${product.stockQuantity}, yêu cầu: ${requestedQuantity}`,
      );
    }
  }

  /**
   * Kiểm tra giá sản phẩm
   */
  private checkPrice(price: number): void {
    // Nếu giá sản phẩm < 0
    if (price < 0) {
      throw new BadRequestException(`Giá sản phẩm không hợp lệ: ${price}`);
    }
  }
}
