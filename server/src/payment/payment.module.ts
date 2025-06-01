import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SepayProvider } from './providers/sepay.provider';
import { PaymentProviderFactory } from './providers/payment-provider.factory';
import { OrdersModule } from '@/orders/orders.module';
import sepayConfig from '@/config/sepay.config';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [ConfigModule.forFeature(sepayConfig), forwardRef(() => OrdersModule), AuthModule],
  controllers: [PaymentController],
  providers: [PaymentService, SepayProvider, PaymentProviderFactory],
  exports: [PaymentService],
})
export class PaymentModule {}
