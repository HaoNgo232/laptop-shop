import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { PaymentsService } from '@/payments/payments.service';
import { CreatePaymentDto } from '@/payments/dtos/create-payment.dto';
import { SepayWebhookDto } from '@/payments/dtos/sepay-webhook.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { WebhookResponse } from '@/payments/interfaces/webhook-response.interfaces';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Thanh toán')
@Controller('api/payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Endpoint dùng để tạo QR code cho thanh toán
   */
  @Post('create')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Tạo QR thanh toán' })
  @ApiOkResponse({ description: 'Trả về thông tin QR để thanh toán.' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<QRCodeResponse> {
    return await this.paymentsService.generateQRCode(createPaymentDto);
  }

  /**
   * Endpoint chỉ dùng để nhận webhook sepay
   * Webhook hiện tại chưa bắn về signature do SEPAY_WEBHOOK_SECRET chưa được cấu hình
   */
  @Post('webhook/sepay')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook SePay' })
  @ApiOkResponse({ description: 'Tiếp nhận và xử lý webhook từ SePay.' })
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

  /**
   * Endpoint dùng để lấy danh sách các phương thức thanh toán
   */
  @Get('methods')
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Danh sách phương thức thanh toán khả dụng' })
  @ApiOkResponse({ description: 'Trả về danh sách phương thức thanh toán.' })
  getPaymentMethods(): { methods: PaymentMethodEnum[] } {
    return {
      methods: this.paymentsService.getAvailableMethods(),
    };
  }

  /**
   * Endpoint dùng để chuyển đổi phương thức thanh toán
   */
  @Post('switch/:orderId')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Chuyển đổi phương thức thanh toán' })
  @ApiOkResponse({ description: 'Trả về QR mới (nếu chuyển sang SePay) hoặc xác nhận chuyển đổi.' })
  @ApiParam({ name: 'orderId', description: 'ID đơn hàng' })
  async switchPaymentMethod(
    @Param('orderId') orderId: string,
    @Body()
    body: {
      amount: number;
      fromMethod: PaymentMethodEnum;
      toMethod: PaymentMethodEnum;
    },
  ): Promise<QRCodeResponse> {
    return await this.paymentsService.switchMethod(
      orderId,
      body.amount,
      body.fromMethod,
      body.toMethod,
    );
  }
}
