import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';
import { PaymentProviderFactory } from './providers/payment-provider.factory';
import {
  QRCodeResponse,
  TransactionResult,
  QRGenerationRequest,
} from '@/payments/interfaces/payment-provider.interfaces';
import { AdminOrdersService } from '@/orders/services/admin-orders.service';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { WebhookResponse } from '@/payments/interfaces/webhook-response.interfaces';
import { CreatePaymentDto } from '@/payments/dtos/create-payment.dto';

interface IPaymentsService {
  generateQRCode(createPaymentDto: CreatePaymentDto): Promise<QRCodeResponse>;
  processWebhook(
    providerMethod: PaymentMethodEnum,
    payload: any,
    signature?: string,
  ): Promise<WebhookResponse>;
  getAvailableMethods(): PaymentMethodEnum[];
  isMethodSupported(method: PaymentMethodEnum): boolean;
  switchMethod(
    orderId: string,
    amount: number,
    fromMethod: PaymentMethodEnum,
    toMethod: PaymentMethodEnum,
  ): Promise<QRCodeResponse>;
}

@Injectable()
export class PaymentsService implements IPaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly paymentProviderFactory: PaymentProviderFactory,
    @Inject(forwardRef(() => AdminOrdersService))
    private readonly adminOrdersService: AdminOrdersService,
  ) {}

  /**
   * Tạo QR code thanh toán (được gọi bởi OrdersService)
   */
  async generateQRCode(createPaymentDto: CreatePaymentDto): Promise<QRCodeResponse> {
    const { orderId, amount, paymentMethod, bankAccount, expireMinutes } = createPaymentDto;
    try {
      if (!this.paymentProviderFactory.isProviderSupported(paymentMethod)) {
        throw new BadRequestException(`Phuong thuc thanh toan ${paymentMethod} khong duoc ho tro`);
      }

      const provider = this.paymentProviderFactory.getProvider(paymentMethod);

      const qrRequest: QRGenerationRequest = {
        orderId,
        amount,
        content: `Thanh toan cho don hang ${orderId}`,
        bankAccount,
        expireMinutes,
      };

      const result = await provider.generateQRCode(qrRequest);

      this.logger.log(`Tao QR code thanh toan cho don hang ${orderId} thanh cong`);
      return result;
    } catch (error) {
      this.logger.error(`Tạo QR code thất bại cho đơn hàng ${orderId}:`, error);
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
  ): Promise<WebhookResponse> {
    try {
      const provider = this.paymentProviderFactory.getProvider(providerMethod);

      // Kiểm tra webhook
      if (!provider.verifyWebhook(payload, signature)) {
        throw new BadRequestException('Webhook khong hop le');
      }

      // Xử lý giao dich
      const result = await provider.processTransaction(payload);

      // Log thông tin giao dich
      this.logger.log(
        `Processed ${result.status} transaction ${result.transactionId} for order ${result.orderId}`,
      );

      // Cập nhật trạng thái thanh toán
      if (result.status === 'success') {
        // Cập nhật trạng thái thanh toán thành PAID
        await this.adminOrdersService.updatePaymentStatus(
          result.orderId,
          result.transactionId,
          PaymentStatusEnum.PAID,
        );

        this.logger.log(`Don hang ${result.orderId} thanh toan thanh cong`);
      } else if (result.status === 'failed') {
        // Cập nhật trạng thái thanh toán thành FAILED
        await this.adminOrdersService.updatePaymentStatus(
          result.orderId,
          result.transactionId,
          PaymentStatusEnum.FAILED,
        );

        this.logger.log(`Don hang ${result.orderId} thanh toan that bai`);
      }

      return {
        success: true,
        message: 'Webhook processed successfully',
        transactionId: result.transactionId,
        orderId: result.orderId,
        status: result.status,
      };
    } catch (error) {
      this.logger.error(`Failed to process webhook for ${providerMethod}:`, error);

      return {
        success: false,
        message: 'Webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getAvailableMethods(): PaymentMethodEnum[] {
    return this.paymentProviderFactory.getAvailableProviders();
  }

  isMethodSupported(method: PaymentMethodEnum): boolean {
    return this.paymentProviderFactory.isProviderSupported(method);
  }

  async switchMethod(
    orderId: string,
    amount: number,
    fromMethod: PaymentMethodEnum,
    toMethod: PaymentMethodEnum,
  ): Promise<QRCodeResponse> {
    try {
      if (!this.isMethodSupported(toMethod)) {
        throw new BadRequestException(`Phuong thuc thanh toan ${toMethod} khong duoc ho tro`);
      }

      this.logger.log(
        `Chuyen doi phuong thuc thanh toan cho don hang ${orderId} tu ${fromMethod} sang ${toMethod}`,
      );

      return await this.generateQRCode({
        orderId,
        amount,
        paymentMethod: toMethod,
      });
    } catch (error) {
      this.logger.error(`Chuyen phuong thuc thanh cho don hanh that bai ${orderId}:`, error);
      throw error;
    }
  }
}
