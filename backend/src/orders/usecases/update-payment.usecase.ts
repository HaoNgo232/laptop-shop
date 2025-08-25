import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Order } from '@/orders/entities/order.entity';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { Product } from '@/products/entities/product.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { RestoreStockUseCase } from './restore-stock.usecase';

export interface UpdatePaymentStatusCommand {
  orderId: string;
  transactionId: string;
  paymentStatus: PaymentStatusEnum;
}

@Injectable()
export class UpdatePaymentUseCase {
  private readonly logger = new Logger(UpdatePaymentUseCase.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly restoreStockUseCase: RestoreStockUseCase,
  ) {}

  /**
   * Cập nhật payment status của order
   */
  async execute(command: UpdatePaymentStatusCommand): Promise<Order> {
    const { orderId, transactionId, paymentStatus } = command;

    return await this.dataSource.transaction(async (manager) => {
      // 1. Lock và lấy order
      const order = await this.lockOrder(manager, orderId);

      // 2. Validate current payment status
      if (!this.canUpdatePaymentStatus(order, transactionId)) {
        return order;
      }

      // 3. Update payment information
      order.paymentStatus = paymentStatus;
      order.transactionId = transactionId;

      // 4. Update order status based on payment status
      await this.updateStatusByPayment(manager, order, paymentStatus);

      // 5. Save and return
      const savedOrder = await manager.save(order);
      this.logger.log(
        `Order ${orderId} payment status updated: ${paymentStatus}, order status: ${savedOrder.status}`,
      );

      return savedOrder;
    });
  }

  /**
   * Lock order và lấy order
   */
  private async lockOrder(manager: EntityManager, orderId: string): Promise<Order> {
    // EntityManager from TypeORM transaction
    const order = await manager.findOne(Order, {
      where: { id: orderId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  /**
   * Kiểm tra xem có thể cập nhật payment status không
   */
  private canUpdatePaymentStatus(order: Order, transactionId: string): boolean {
    // Chỉ cập nhật nếu đang PENDING payment
    if (order.paymentStatus !== PaymentStatusEnum.PENDING) {
      this.logger.warn(
        `Attempted to update payment status for order ${order.id} ` +
          `but current status is ${order.paymentStatus}`,
      );
      return false;
    }

    // Kiểm tra duplicate transaction
    if (order.transactionId && order.transactionId === transactionId) {
      this.logger.warn(`Duplicate transaction ${transactionId} for order ${order.id}`);
      return false;
    }

    return true;
  }

  /**
   * Cập nhật status của order dựa vào payment status
   */
  private async updateStatusByPayment(
    manager: EntityManager,
    order: Order,
    paymentStatus: PaymentStatusEnum,
  ): Promise<void> {
    switch (paymentStatus) {
      case PaymentStatusEnum.PAID:
        // Payment successful -> chuyển sang PROCESSING và convert reserved stock thành actual stock decrement
        order.status = OrderStatusEnum.PROCESSING;
        await this.convertReservedToActualStock(manager, order.id);
        break;

      case PaymentStatusEnum.FAILED:
        // Payment failed -> cancel order và restore stock
        order.status = OrderStatusEnum.CANCELLED;
        await this.restoreStockUseCase.execute(manager, order.id);
        break;

      case PaymentStatusEnum.CANCELLED:
        // Payment cancelled -> cancel order và restore stock
        order.status = OrderStatusEnum.CANCELLED;
        await this.restoreStockUseCase.execute(manager, order.id);
        break;

      case PaymentStatusEnum.WAITING:
        // Payment waiting -> order status vẫn PENDING
        // No action needed
        break;

      default:
        this.logger.warn(`Unknown payment status: ${paymentStatus} for order ${order.id}`);
    }
  }

  /**
   * Convert reserved stock thành actual stock decrement khi payment PAID
   */
  private async convertReservedToActualStock(
    manager: EntityManager,
    orderId: string,
  ): Promise<void> {
    try {
      // Lấy order với items
      const orderWithItems = await manager.findOne(Order, {
        where: { id: orderId },
        relations: ['items'],
      });

      if (!orderWithItems?.items) {
        this.logger.warn(`No items found for order ${orderId} to convert reserved stock`);
        return;
      }

      // Convert reserved stock cho từng item
      for (const item of orderWithItems.items) {
        // Decrement actual stock và decrement reserved stock
        await manager.decrement(Product, { id: item.productId }, 'stockQuantity', item.quantity);
        await manager.decrement(Product, { id: item.productId }, 'reservedQuantity', item.quantity);

        this.logger.debug(
          `Converted ${item.quantity} reserved units to actual stock for product ${item.productId} in order ${orderId}`,
        );
      }

      this.logger.log(`Reserved stock converted to actual stock for order ${orderId}`);
    } catch (error) {
      this.logger.error(`Failed to convert reserved stock for order ${orderId}:`, error);
      throw error;
    }
  }
}
