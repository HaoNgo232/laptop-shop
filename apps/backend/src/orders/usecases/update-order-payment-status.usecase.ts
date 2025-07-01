import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Order } from '@/orders/entities/order.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { RestoreStockUseCase } from './restore-stock.usecase';

export interface UpdatePaymentStatusCommand {
  orderId: string;
  transactionId: string;
  paymentStatus: PaymentStatusEnum;
}

@Injectable()
export class UpdateOrderPaymentStatusUseCase {
  private readonly logger = new Logger(UpdateOrderPaymentStatusUseCase.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly restoreStockUseCase: RestoreStockUseCase,
  ) {}

  /**
   * Update order payment status với business logic
   * Tuân thủ Single Responsibility Principle - chỉ lo update payment status
   */
  async execute(command: UpdatePaymentStatusCommand): Promise<Order> {
    const { orderId, transactionId, paymentStatus } = command;

    return await this.dataSource.transaction(async (manager) => {
      // 1. Lock và lấy order
      const order = await this.lockAndGetOrder(manager, orderId);

      // 2. Validate current payment status
      if (!this.canUpdatePaymentStatus(order, transactionId)) {
        return order;
      }

      // 3. Update payment information
      order.paymentStatus = paymentStatus;
      order.transactionId = transactionId;

      // 4. Update order status based on payment status
      await this.updateOrderStatusBasedOnPayment(manager, order, paymentStatus);

      // 5. Save and return
      const savedOrder = await manager.save(order);
      this.logger.log(
        `Order ${orderId} payment status updated: ${paymentStatus}, order status: ${savedOrder.status}`,
      );

      return savedOrder;
    });
  }

  private async lockAndGetOrder(manager: EntityManager, orderId: string): Promise<Order> {
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

  private async updateOrderStatusBasedOnPayment(
    manager: EntityManager,
    order: Order,
    paymentStatus: PaymentStatusEnum,
  ): Promise<void> {
    switch (paymentStatus) {
      case PaymentStatusEnum.PAID:
        // Payment successful -> chuyển sang PROCESSING
        order.status = OrderStatusEnum.PROCESSING;
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
}
