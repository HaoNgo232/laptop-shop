import { Injectable, Logger } from '@nestjs/common';
import { Order } from '@/orders/entities/order.entity';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';
import { PaymentsService } from '@/payments/payments.service';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';

@Injectable()
export class GeneratePaymentQrUseCase {
  private readonly logger = new Logger(GeneratePaymentQrUseCase.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Tạo QR code cho payment nếu cần thiết
   * Tuân thủ Single Responsibility Principle - chỉ lo QR generation
   */
  async execute(
    order: Order,
    paymentMethod: PaymentMethodEnum,
  ): Promise<QRCodeResponse | undefined> {
    if (!this.shouldGenerateQR(paymentMethod)) {
      return undefined;
    }

    try {
      const qrCode = await this.paymentsService.generateQRCode({
        orderId: order.id,
        amount: Number(order.totalAmount),
        paymentMethod,
        expireMinutes: 15,
      });

      this.logger.log(`QR code generated successfully for order ${order.id}`);
      return qrCode;
    } catch (qrError) {
      // QR generation failure không should fail order creation
      this.logger.error(`Failed to generate QR code for order ${order.id}:`, qrError);
      return undefined;
    }
  }

  private shouldGenerateQR(paymentMethod: PaymentMethodEnum): boolean {
    return paymentMethod === PaymentMethodEnum.SEPAY_QR;
  }
}
