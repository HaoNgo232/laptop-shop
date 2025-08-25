import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { AdminDashboardController } from '@/admin/controllers/admin-dashboard.controller';
import { AdminDashboardService } from '@/admin/services/admin-dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/auth/entities/user.entity';
import { ManagerUsersController } from './controllers/manager-users.controller';
import { ManagerUsersService } from '@/admin/services/manager-users.service';
import { Product } from '@/products/entities/product.entity';
import { Order } from '@/orders/entities/order.entity';
import { ProductsModule } from '@/products/products.module';
import { OrdersModule } from '@/orders/orders.module';
import { UploadController } from './controllers/upload.controller';

/**
 * Module đặc biệt dành cho admin
 */
@Module({
  imports: [
    AuthModule,
    ProductsModule,
    OrdersModule,
    TypeOrmModule.forFeature([User, Product, Order]),
  ],
  controllers: [AdminDashboardController, ManagerUsersController, UploadController],
  providers: [AdminDashboardService, ManagerUsersService],
  exports: [AdminDashboardService, ManagerUsersService],
})
export class AdminModule {}
