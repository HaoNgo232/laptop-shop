import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Order } from '@/orders/entities/order.entity';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { Product } from '@/products/entities/product.entity';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { CartService } from '@/cart/cart.service';

export interface CreateOrderCommand {
  userId: string;
  createOrderDto: CreateOrderDto;
  orderItems: Pick<OrderItem, 'productId' | 'quantity' | 'priceAtPurchase'>[];
  totalAmount: number;
}

@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly cartService: CartService,
  ) {}

  /**
   * Tạo đơn hàng trong transaction
   */
  async execute(command: CreateOrderCommand): Promise<Order> {
    const { userId, createOrderDto, orderItems, totalAmount } = command;

    try {
      return await this.dataSource.transaction(async (manager) => {
        // 1. Tạo order entity với expiration time
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 phút timeout

        const order = manager.create(Order, {
          userId,
          totalAmount,
          shippingAddress: createOrderDto.shippingAddress,
          paymentMethod: createOrderDto.paymentMethod,
          note: createOrderDto.note,
          status: OrderStatusEnum.PENDING,
          paymentStatus: PaymentStatusEnum.PENDING,
          expiresAt,
        });

        const savedOrder = await manager.save(order);

        // 2. Tạo order items và reserve stock
        await this.processOrderItems(manager, savedOrder.id, orderItems);

        // 3. Clear user cart
        await this.cartService.clear(userId);

        this.logger.log(`Order ${savedOrder.id} created successfully for user ${userId}`);
        return savedOrder;
      });
    } catch (error) {
      this.logger.error('Error creating order transaction:', error);
      throw new BadRequestException(`Không thể tạo đơn hàng: ${error}`);
    }
  }

  private async processOrderItems(
    manager: EntityManager, // EntityManager from TypeORM transaction
    orderId: string,
    orderItems: Pick<OrderItem, 'productId' | 'quantity' | 'priceAtPurchase'>[],
  ): Promise<void> {
    for (const item of orderItems) {
      // Tạo order item
      const orderItem = manager.create(OrderItem, {
        ...item,
        orderId,
      });
      await manager.save(orderItem);

      // Reserve stock thay vì trừ stock ngay lập tức
      await manager.increment(Product, { id: item.productId }, 'reservedQuantity', item.quantity);
    }
  }
}
