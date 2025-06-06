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
import { PaymentMethodEnum } from '@/payment/enums/payment-method.enum';
import { SepayWebhookDto } from './dtos/sepay-webhook.dto';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { OrdersService } from '@/orders/orders.service';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { CreatePaymentDto } from '@/payment/dtos/create-payment.dto';
import { QRCodeResponse } from '@/payment/interfaces/payment-provider.interfaces';
import {
  FailedWebhookResponse,
  SuccessWebhookResponse,
} from '@/payment/interfaces/webhook-response.interfaces';

@ApiTags('Payment')
@Controller('/api/payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('create')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Tạo thanh toán mới' })
  @ApiResponse({ status: 201, description: 'Tạo thanh toán thành công' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<QRCodeResponse> {
    try {
      return await this.paymentService.generateQRCode(
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
  @ApiOperation({ summary: 'Webhook endpoint cho SePay' })
  @ApiResponse({ status: 200, description: 'Webhook xử lý thành công' })
  async handleSepayWebhook(
    @Body() payload: SepayWebhookDto,
    @Headers('x-sepay-signature') signature?: string,
  ): Promise<SuccessWebhookResponse | FailedWebhookResponse> {
    try {
      this.logger.log(`Received SePay webhook for transaction: ${payload.id}`);

      const result = await this.paymentService.processWebhook(
        PaymentMethodEnum.SEPAY_QR,
        payload,
        signature,
      );

      // Cập nhật order status dựa trên kết quả
      if (result.status === 'success') {
        await this.ordersService.updateOrderPaymentStatus(
          result.orderId,
          result.transactionId,
          PaymentStatusEnum.PAID,
        );
        this.logger.log(`Order ${result.orderId} payment status updated to PAID`);
      } else if (result.status === 'failed') {
        await this.ordersService.updateOrderPaymentStatus(
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

      // Return 200 to SePay để tránh retry
      return {
        success: false,
        message: 'Webhook processing failed',
        error: error.message,
      };
    }
  }

  @Get('methods')
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Lấy danh sách phương thức thanh toán' })
  async getPaymentMethods(): Promise<{ methods: PaymentMethodEnum[] }> {
    return {
      methods: this.paymentService.getAvailablePaymentMethods(),
    };
  }

  @Post('switch/:orderId')
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Chuyển đổi phương thức thanh toán' })
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
      return await this.paymentService.switchPaymentMethod(
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
