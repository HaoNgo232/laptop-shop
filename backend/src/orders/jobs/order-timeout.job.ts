import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Order } from '@/orders/entities/order.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { RestoreStockUseCase } from '@/orders/usecases/restore-stock.usecase';

@Injectable()
export class OrderTimeoutJob {
  private readonly logger = new Logger(OrderTimeoutJob.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly restoreStockUseCase: RestoreStockUseCase,
  ) {}

  /**
   * Cron job chạy mỗi 5 phút để tìm và cancel orders pending > 30 phút
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleOrderTimeout(): Promise<void> {
    try {
      this.logger.log('Starting order timeout check...');

      await this.dataSource.transaction(async (manager) => {
        // Tìm orders PENDING quá 30 phút
        const expiredOrders = await manager
          .createQueryBuilder(Order, 'order')
          .where('order.status = :status', { status: OrderStatusEnum.PENDING })
          .andWhere('order.paymentStatus = :paymentStatus', {
            paymentStatus: PaymentStatusEnum.PENDING,
          })
          .andWhere('order.expiresAt < :now', { now: new Date() })
          .getMany();

        if (expiredOrders.length === 0) {
          this.logger.log('No expired orders found');
          return;
        }

        this.logger.log(`Found ${expiredOrders.length} expired orders to cancel`);

        // Cancel từng order và restore stock
        for (const order of expiredOrders) {
          try {
            // Update order status
            order.status = OrderStatusEnum.CANCELLED;
            order.paymentStatus = PaymentStatusEnum.CANCELLED;
            await manager.save(order);

            // Restore reserved stock
            await this.restoreStockUseCase.execute(manager, order.id);

            this.logger.log(`Order ${order.id} cancelled due to timeout`);
          } catch (error) {
            this.logger.error(`Failed to cancel expired order ${order.id}:`, error);
            // Continue với orders khác
          }
        }

        this.logger.log(`Order timeout check completed. Cancelled ${expiredOrders.length} orders`);
      });
    } catch (error) {
      this.logger.error('Error during order timeout check:', error);
    }
  }
}
