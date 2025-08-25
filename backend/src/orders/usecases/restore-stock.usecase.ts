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

      // Restore stock cho từng item (chỉ restore reserved stock vì actual stock chưa bị trừ)
      for (const item of orderWithItems.items) {
        // Chỉ restore reserved stock vì đây là order bị cancel/failed
        await manager.decrement(Product, { id: item.productId }, 'reservedQuantity', item.quantity);

        this.logger.debug(
          `Restored ${item.quantity} reserved units of product ${item.productId} for order ${orderId}`,
        );
      }

      this.logger.log(`Stock restored successfully for order ${orderId}`);
    } catch (error) {
      this.logger.error(`Failed to restore stock for order ${orderId}:`, error);
      throw error;
    }
  }
}
