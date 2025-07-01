import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Order } from '@/orders/entities/order.entity';
import { Product } from '@/products/entities/product.entity';

@Injectable()
export class RestoreStockUseCase {
  private readonly logger = new Logger(RestoreStockUseCase.name);

  /**
   * Restore stock khi payment failed hoặc order cancelled
   * Tuân thủ Single Responsibility Principle - chỉ lo restore stock
   */
  async execute(manager: EntityManager, orderId: string): Promise<void> {
    try {
      // Lấy order với items
      const orderWithItems = await manager.findOne(Order, {
        where: { id: orderId },
        relations: ['items'],
      });

      if (!orderWithItems?.items) {
        this.logger.warn(`No items found for order ${orderId} to restore stock`);
        return;
      }

      // Restore stock cho từng item
      for (const item of orderWithItems.items) {
        await manager.increment(Product, { id: item.productId }, 'stockQuantity', item.quantity);

        this.logger.debug(
          `Restored ${item.quantity} units of product ${item.productId} for order ${orderId}`,
        );
      }

      this.logger.log(`Stock restored successfully for order ${orderId}`);
    } catch (error) {
      this.logger.error(`Failed to restore stock for order ${orderId}:`, error);
      throw error;
    }
  }
}
