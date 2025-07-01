import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { PaymentsService } from '@/payments/payments.service';
import { CreatePaymentDto } from '@/payments/dtos/create-payment.dto';
import { SepayWebhookDto } from '@/payments/dtos/sepay-webhook.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import {
  FailedWebhookResponse,
  SuccessWebhookResponse,
} from '@/payments/interfaces/webhook-response.interfaces';
import { PaymentMethodEnum } from '@/payments/enums/payment-method.enum';
import { AdminOrdersService } from '@/orders/services/admin-orders.service';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';

@Controller('api/payment')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly adminOrdersService: AdminOrdersService,
  ) {}

  @Post('create')
  @Auth(AuthType.Bearer)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<QRCodeResponse> {
    try {
      return await this.paymentsService.generateQRCode(
        createPaymentDto.orderId,
        createPaymentDto.amount,
        createPaymentDto.provider,
        {
          bankAccount: createPaymentDto.bankAccount,
          expireMinutes: createPaymentDto.expireMinutes,
        },
      );
    } catch (error) {
      this.logger.error('Error creating payment:', error);
      throw error;
    }
  }

  @Post('webhook/sepay')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  async handleSepayWebhook(
    @Body() payload: SepayWebhookDto,
    @Headers('x-sepay-signature') signature?: string,
  ): Promise<SuccessWebhookResponse | FailedWebhookResponse> {
    try {
      this.logger.log(`Received SePay webhook for transaction: ${payload.id}`);

      const result = await this.paymentsService.processWebhook(
        PaymentMethodEnum.SEPAY_QR,
        payload,
        signature,
      );

      // Cập nhật order status dựa trên kết quả
      if (result.status === 'success') {
        await this.adminOrdersService.updatePaymentStatus(
          result.orderId,
          result.transactionId,
          PaymentStatusEnum.PAID,
        );
        this.logger.log(`Order ${result.orderId} payment status updated to PAID`);
      } else if (result.status === 'failed') {
        await this.adminOrdersService.updatePaymentStatus(
          result.orderId,
          result.transactionId,
          PaymentStatusEnum.FAILED,
        );
        this.logger.log(`Order ${result.orderId} payment status updated to FAILED`);
      }

      return {
        success: true,
        message: 'Webhook processed successfully',
        transactionId: result.transactionId,
        orderId: result.orderId,
        status: result.status,
      };
    } catch (error) {
      this.logger.error('Error processing SePay webhook:', error);

      return {
        success: false,
        message: 'Webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('methods')
  @Auth(AuthType.None)
  getPaymentMethods(): { methods: PaymentMethodEnum[] } {
    return {
      methods: this.paymentsService.getAvailablePaymentMethods(),
    };
  }

  @Post('switch/:orderId')
  @Auth(AuthType.Bearer)
  async switchPaymentMethod(
    @Param('orderId') orderId: string,
    @Body()
    body: {
      amount: number;
      fromMethod: PaymentMethodEnum;
      toMethod: PaymentMethodEnum;
    },
  ): Promise<QRCodeResponse> {
    try {
      return await this.paymentsService.switchPaymentMethod(
        orderId,
        body.amount,
        body.fromMethod,
        body.toMethod,
      );
    } catch (error) {
      this.logger.error(`Error switching payment method for order ${orderId}:`, error);
      throw error;
    }
  }
}
