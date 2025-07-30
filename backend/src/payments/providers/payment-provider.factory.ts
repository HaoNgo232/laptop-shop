import { Injectable, Logger } from '@nestjs/common';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';
import {
  QRCodeResponse,
  QRGenerationRequest,
  TransactionResult,
} from '@/payments/interfaces/payment-provider.interfaces';
import { SepayProvider } from './sepay.provider';

export interface PaymentProvider {
  readonly name: string;
  generateQRCode(orderInfo: QRGenerationRequest): Promise<QRCodeResponse>;
  verifyWebhook(payload: any, signature?: string): boolean;
  processTransaction(transaction: any): Promise<TransactionResult>;
}
/**
 * Factory để tạo và quản lý các provider thanh toán
 */
@Injectable()
export class PaymentProviderFactory {
  private readonly logger = new Logger(PaymentProviderFactory.name);
  private readonly providers: Map<PaymentMethodEnum, PaymentProvider> = new Map();

  constructor(private readonly sepayProvider: SepayProvider) {
    this.registerProviders();
  }

  private registerProviders(): void {
    this.providers.set(PaymentMethodEnum.SEPAY_QR, this.sepayProvider);
    // Future providers:
    // this.providers.set(PaymentMethodEnum.VNPAY, this.vnpayProvider);
    // this.providers.set(PaymentMethodEnum.MOMO, this.momoProvider);

    this.logger.log(`Registered ${this.providers.size} payment providers`);
  }

  getProvider(method: PaymentMethodEnum): PaymentProvider {
    const provider = this.providers.get(method);
    if (!provider) {
      throw new Error(`Payment provider for method ${method} not found`);
    }
    return provider;
  }

  getAvailableProviders(): PaymentMethodEnum[] {
    return Array.from(this.providers.keys());
  }

  getAllProviders(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  isProviderSupported(method: PaymentMethodEnum): boolean {
    return this.providers.has(method);
  }
}
