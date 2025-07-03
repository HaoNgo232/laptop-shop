import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { PaymentsService } from '@/payments/payments.service';
import { CreatePaymentDto } from '@/payments/dtos/create-payment.dto';
import { SepayWebhookDto } from '@/payments/dtos/sepay-webhook.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { WebhookResponse } from '@/payments/interfaces/webhook-response.interfaces';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';

@Controller('api/payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @Auth(AuthType.Bearer)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<QRCodeResponse> {
    return await this.paymentsService.generateQRCode(createPaymentDto);
  }

  @Post('webhook/sepay')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  async handleSepayWebhook(
    @Body() payload: SepayWebhookDto,
    @Headers('x-sepay-signature') signature?: string,
  ): Promise<WebhookResponse> {
    return await this.paymentsService.processWebhook(
      PaymentMethodEnum.SEPAY_QR,
      payload,
      signature,
    );
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
    return await this.paymentsService.switchPaymentMethod(
      orderId,
      body.amount,
      body.fromMethod,
      body.toMethod,
    );
  }
}
