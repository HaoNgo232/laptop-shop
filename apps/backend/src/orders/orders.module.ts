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
import { UsersOrdersService } from '@/orders/services/users-orders.service';
import { CreatePaginationMetaUseCase } from '@/orders/usecases/create-pagination-meta.usecase';
import { CreateOrderTransactionUseCase } from '@/orders/usecases/create-order-transaction.usecase';
import { GeneratePaymentQrUseCase } from '@/orders/usecases/generate-payment-qr.usecase';
import { ValidateStockUseCase } from '@/orders/usecases/validate-stock.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    CartModule,
    AuthModule,
    forwardRef(() => PaymenstModule),
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [
    AdminOrdersService,
    UsersOrdersService,
    OrdersProvider,
    OrderMapperProvider,
    CreatePaginationMetaUseCase,
    ValidateStockUseCase,
    CreateOrderTransactionUseCase,
    GeneratePaymentQrUseCase,
  ],
  exports: [AdminOrdersService, UsersOrdersService],
})
export class OrdersModule {}
