import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { OrdersModule } from '@/orders/orders.module';
import { PaymentsController } from './payments.controller';
import { PaymentProviderFactory } from './providers/payment-provider.factory';
import { SepayProvider } from './providers/sepay.provider';
import { PaymentsService } from './payments.service';
import sepayConfig from '@/config/sepay.config';

/**
 * Module để quản lý thanh toán
 */
@Module({
  imports: [ConfigModule.forFeature(sepayConfig), forwardRef(() => OrdersModule), AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, SepayProvider, PaymentProviderFactory],
  exports: [PaymentsService],
})
export class PaymenstModule {}
