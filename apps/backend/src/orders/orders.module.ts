import { AuthModule } from '@/auth/auth.module';
import { CartModule } from '@/cart/cart.module';
import { AdminOrdersController } from '@/orders/admin-order.controller';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { Order } from '@/orders/entities/order.entity';
import { OrdersController } from '@/orders/orders.controller';
import { OrdersService } from '@/orders/orders.service';
import { OrderMapperProvider } from '@/orders/providers/order-mapper.provider';
import { OrdersProvider } from '@/orders/providers/order.provider';
import { PaymentModule } from '@/payment/payment.module';
import { Product } from '@/products/entities/product.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    CartModule,
    AuthModule,
    forwardRef(() => PaymentModule),
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService, OrdersProvider, OrderMapperProvider],
  exports: [OrdersService],
})
export class OrdersModule {}
