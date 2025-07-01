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
export class CreateOrderTransactionUseCase {
  private readonly logger = new Logger(CreateOrderTransactionUseCase.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly cartService: CartService,
  ) {}

  /**
   * Tạo đơn hàng trong transaction
   * Tuân thủ Single Responsibility Principle - chỉ lo tạo order và transaction
   */
  async execute(command: CreateOrderCommand): Promise<Order> {
    const { userId, createOrderDto, orderItems, totalAmount } = command;

    try {
      return await this.dataSource.transaction(async (manager) => {
        // 1. Tạo order entity
        const order = manager.create(Order, {
          userId,
          totalAmount,
          shippingAddress: createOrderDto.shippingAddress,
          paymentMethod: createOrderDto.paymentMethod,
          note: createOrderDto.note,
          status: OrderStatusEnum.PENDING,
          paymentStatus: PaymentStatusEnum.PENDING,
        });

        const savedOrder = await manager.save(order);

        // 2. Tạo order items và update stock
        await this.createOrderItemsAndUpdateStock(manager, savedOrder.id, orderItems);

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

  private async createOrderItemsAndUpdateStock(
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

      // Cập nhật stock với atomic operation
      await manager.decrement(Product, { id: item.productId }, 'stockQuantity', item.quantity);
    }
  }
}
