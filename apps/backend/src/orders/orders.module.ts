import { AuthModule } from '@/auth/auth.module';
import { CartModule } from '@/cart/cart.module';
import { AdminOrdersController } from '@/orders/controllers/admin-order.controller';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { Order } from '@/orders/entities/order.entity';
import { OrdersController } from '@/orders/controllers/orders.controller';
import { OrdersService } from '@/orders/orders.service';
import { OrderMapperProvider } from '@/orders/providers/order-mapper.provider';
import { OrdersProvider } from '@/orders/providers/order.provider';
import { PaymenstModule } from '@/payments/payments.module';
import { Product } from '@/products/entities/product.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    CartModule,
    AuthModule,
    forwardRef(() => PaymenstModule),
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService, OrdersProvider, OrderMapperProvider],
  exports: [OrdersService],
})
export class OrdersModule {}
