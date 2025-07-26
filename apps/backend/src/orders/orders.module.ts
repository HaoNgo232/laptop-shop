import { AuthModule } from '@/auth/auth.module';
import { CartModule } from '@/cart/cart.module';
import { AdminOrdersController } from '@/orders/controllers/admin-order.controller';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { Order } from '@/orders/entities/order.entity';
import { OrdersController } from '@/orders/controllers/orders.controller';
import { AdminOrdersService } from '@/orders/services/admin-orders.service';
import { OrderMapperProvider } from '@/orders/providers/order-mapper.provider';
import { OrdersProvider } from '@/orders/providers/order.provider';
import { PaymenstModule } from '@/payments/payments.module';
import { Product } from '@/products/entities/product.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from '@/orders/services/orders.service';
import { CreateOrderUseCase } from '@/orders/usecases/create-order.usecase';
import { ValidateStockUseCase } from '@/orders/usecases/validate-stock.usecase';
import { RankService } from './services/rank.service';
import { DiscountService } from './services/discount.service';
import { User } from '@/auth/entities/user.entity';

/**
 * Module để quản lý đơn hàng
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, User]),
    CartModule,
    AuthModule,
    forwardRef(() => PaymenstModule),
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [
    // services
    AdminOrdersService,
    OrdersService,
    RankService,
    DiscountService,
    // providers
    OrdersProvider,
    OrderMapperProvider,
    // usecases
    ValidateStockUseCase,
    CreateOrderUseCase,
  ],
  exports: [AdminOrdersService, OrdersService, RankService, DiscountService],
})
export class OrdersModule {}
