import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { OrdersModule } from '@/orders/orders.module';
import { PaymentController } from './payment.controller';
import { PaymentProviderFactory } from './providers/payment-provider.factory';
import { SepayProvider } from './providers/sepay.provider';
import { PaymentService } from './payment.service';
import sepayConfig from '@/config/sepay.config';

@Module({
  imports: [ConfigModule.forFeature(sepayConfig), forwardRef(() => OrdersModule), AuthModule],
  controllers: [PaymentController],
  providers: [PaymentService, SepayProvider, PaymentProviderFactory],
  exports: [PaymentService],
})
export class PaymentModule {}
