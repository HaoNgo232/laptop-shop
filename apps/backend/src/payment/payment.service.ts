import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PaymentMethodEnum } from '@/payment/enums/payment-method.enum';
import { PaymentProviderFactory } from './providers/payment-provider.factory';
import {
  QRCodeResponse,
  TransactionResult,
  QRGenerationRequest,
} from '@/payment/interfaces/payment-provider.interfaces';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly paymentProviderFactory: PaymentProviderFactory) {}

  /**
   * Tạo QR code thanh toán (được gọi bởi OrdersService)
   */
  async generateQRCode(
    orderId: string,
    amount: number,
    paymentMethod: PaymentMethodEnum,
    additionalInfo?: Partial<QRGenerationRequest>,
  ): Promise<QRCodeResponse> {
    try {
      if (!this.paymentProviderFactory.isProviderSupported(paymentMethod)) {
        throw new BadRequestException(`Payment method ${paymentMethod} is not supported`);
      }

      const provider = this.paymentProviderFactory.getProvider(paymentMethod);

      const qrRequest: QRGenerationRequest = {
        orderId,
        amount,
        content: `Thanh toan cho don hang ${orderId}`,
        ...additionalInfo,
      };

      const result = await provider.generateQRCode(qrRequest);

      this.logger.log(`Generated QR code for order ${orderId} using ${paymentMethod}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to generate QR code for order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Xử lý webhook từ payment provider
   */
  async processWebhook(
    providerMethod: PaymentMethodEnum,
    payload: any,
    signature?: string,
  ): Promise<TransactionResult> {
    try {
      const provider = this.paymentProviderFactory.getProvider(providerMethod);

      // Verify webhook
      if (!provider.verifyWebhook(payload, signature)) {
        throw new BadRequestException('Invalid webhook signature or payload');
      }

      // Process transaction
      const result = await provider.processTransaction(payload);

      this.logger.log(
        `Processed ${result.status} transaction ${result.transactionId} for order ${result.orderId}`,
      );

      return result;
    } catch (error) {
      this.logger.error(`Failed to process webhook for ${providerMethod}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách payment methods được hỗ trợ
   */
  getAvailablePaymentMethods(): PaymentMethodEnum[] {
    return this.paymentProviderFactory.getAvailableProviders();
  }

  /**
   * Kiểm tra payment method có được hỗ trợ không
   */
  isPaymentMethodSupported(method: PaymentMethodEnum): boolean {
    return this.paymentProviderFactory.isProviderSupported(method);
  }

  /**
   * Chuyển đổi payment provider cho đơn hàng (fallback mechanism)
   */
  async switchPaymentMethod(
    orderId: string,
    amount: number,
    fromMethod: PaymentMethodEnum,
    toMethod: PaymentMethodEnum,
  ): Promise<QRCodeResponse> {
    try {
      if (!this.isPaymentMethodSupported(toMethod)) {
        throw new BadRequestException(`Target payment method ${toMethod} is not supported`);
      }

      this.logger.log(
        `Switching payment method for order ${orderId} from ${fromMethod} to ${toMethod}`,
      );

      return await this.generateQRCode(orderId, amount, toMethod);
    } catch (error) {
      this.logger.error(`Failed to switch payment method for order ${orderId}:`, error);
      throw error;
    }
  }
}
