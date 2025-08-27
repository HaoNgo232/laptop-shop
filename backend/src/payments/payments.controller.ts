import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, ParseUUIDPipe } from '@nestjs/common';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { PaymentsService } from '@/payments/payments.service';
import { CreatePaymentDto } from '@/payments/dtos/create-payment.dto';
import { SepayWebhookDto } from '@/payments/dtos/sepay-webhook.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { WebhookResponse } from '@/payments/interfaces/webhook-response.interfaces';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';
import { 
  ValidationErrorResponseDto, 
  UnauthorizedErrorResponseDto, 
  NotFoundErrorResponseDto,
  ErrorResponseDto 
} from '@/common/dtos/api-response.dto';
import { 
  ApiBearerAuth, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('💳 Payments')
@ApiExtraModels(CreatePaymentDto, SepayWebhookDto, ValidationErrorResponseDto, UnauthorizedErrorResponseDto, NotFoundErrorResponseDto, ErrorResponseDto)
@Controller('api/payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Endpoint dùng để tạo QR code cho thanh toán
   */
  @Post('create')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ 
    summary: 'Tạo QR code thanh toán',
    description: `
      Tạo QR code cho thanh toán đơn hàng qua SePay.
      
      **Quy trình:**
      1. Xác thực đơn hàng và số tiền
      2. Tạo mã QR duy nhất với mô tả DH{orderId}
      3. Trả về URL QR code và thông tin ngân hàng
      4. QR code có thời hạn (mặc định 15 phút)
      
      **Thông tin QR bao gồm:**
      - URL hình ảnh QR code để hiển thị
      - Số tài khoản ngân hàng nhận tiền
      - Tên chủ tài khoản
      - Mã ngân hàng (VCB, TCB, v.v.)
      - Số tiền cần thanh toán
      
      **Lưu ý:** 
      - Chỉ hỗ trợ thanh toán SEPAY_QR
      - Rate limit: 2 requests/second
      - Webhook sẽ được gọi khi có giao dịch
    `
  })
  @ApiOkResponse({ 
    description: 'QR code đã được tạo thành công.',
    schema: {
      type: 'object',
      properties: {
        qrCodeUrl: { 
          type: 'string', 
          description: 'URL hình ảnh QR code',
          example: 'https://qr.sepay.vn/img?acc=1234567890&bank=VCB&amount=15990000&des=DH650e8400&template=compact' 
        },
        amount: { 
          type: 'number', 
          description: 'Số tiền thanh toán (VND)',
          example: 15990000 
        },
        accountNumber: { 
          type: 'string', 
          description: 'Số tài khoản ngân hàng',
          example: '1234567890' 
        },
        accountName: { 
          type: 'string', 
          description: 'Tên chủ tài khoản',
          example: 'LAPTOP SHOP' 
        },
        bankCode: { 
          type: 'string', 
          description: 'Mã ngân hàng',
          example: 'VCB' 
        },
        description: { 
          type: 'string', 
          description: 'Nội dung chuyển khoản',
          example: 'DH650e8400' 
        },
        expireAt: { 
          type: 'string', 
          format: 'date-time',
          description: 'Thời gian hết hạn QR code',
          example: '2025-08-27T11:45:00.000Z' 
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Dữ liệu không hợp lệ (order ID, amount, payment method) hoặc đơn hàng không hợp lệ.',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Không tìm thấy đơn hàng với ID được cung cấp.',
    type: NotFoundErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi từ SePay API hoặc lỗi server khi tạo QR code.',
    type: ErrorResponseDto 
  })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<QRCodeResponse> {
    return await this.paymentsService.generateQRCode(createPaymentDto);
  }

  /**
   * Endpoint chỉ dùng để nhận webhook sepay
   * Webhook hiện tại chưa bắn về signature do SEPAY_WEBHOOK_SECRET chưa được cấu hình
   */
  @Post('webhook/sepay')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Webhook từ SePay',
    description: `
      Endpoint nhận thông báo từ SePay khi có giao dịch thành công.
      
      **Quy trình:**
      1. SePay gửi POST request khi có giao dịch
      2. Hệ thống xác thực signature (nếu có SEPAY_WEBHOOK_SECRET)
      3. Parse thông tin giao dịch từ content
      4. Tìm đơn hàng dựa trên mã DH{orderId}
      5. Cập nhật trạng thái thanh toán và đơn hàng
      6. Chuyển stock từ reserved sang sold
      7. Gửi email xác nhận (nếu có)
      
      **Format content:** "LAPTOP SHOP DH650e8400 15990000"
      
      **Bảo mật:** 
      - Kiểm tra signature nếu có SEPAY_WEBHOOK_SECRET
      - Validate số tiền và thông tin đơn hàng
      - Chống duplicate processing
      
      **Lưu ý:** Endpoint này không cần authentication.
    `
  })
  @ApiOkResponse({ 
    description: 'Webhook đã được xử lý thành công.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Payment processed successfully' },
        orderId: { type: 'string', example: '650e8400-e29b-41d4-a716-446655440003' },
        transactionId: { type: 'string', example: '20250827123456' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Dữ liệu webhook không hợp lệ hoặc signature không khớp.',
    type: ValidationErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi xử lý webhook.',
    type: ErrorResponseDto 
  })
  @ApiHeader({
    name: 'x-sepay-signature',
    description: 'Signature để xác thực webhook từ SePay',
    required: false,
    schema: { type: 'string', example: 'sha256=abc123...' }
  })
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
   * Endpoint dùng để lấy danh sách các phương thức thanh toán
   */
  @Get('methods')
  @Auth(AuthType.None)
  @ApiOperation({ 
    summary: 'Danh sách phương thức thanh toán',
    description: `
      Lấy danh sách tất cả phương thức thanh toán được hỗ trợ.
      
      **Phương thức hiện tại:**
      - **COD:** Cash on Delivery (Thanh toán khi nhận hàng)
      - **SEPAY_QR:** Thanh toán qua QR code SePay
      
      **Thông tin bao gồm:**
      - Mã phương thức (enum)
      - Tên hiển thị
      - Mô tả chi tiết
      - Trạng thái khả dụng
      
      **Sử dụng:** Hiển thị options cho người dùng chọn khi đặt hàng.
    `
  })
  @ApiOkResponse({ 
    description: 'Danh sách phương thức thanh toán khả dụng.',
    schema: {
      type: 'object',
      properties: {
        methods: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['COD', 'SEPAY_QR']
          },
          example: ['COD', 'SEPAY_QR']
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi lấy danh sách phương thức thanh toán.',
    type: ErrorResponseDto 
  })
  getPaymentMethods(): { methods: PaymentMethodEnum[] } {
    return {
      methods: this.paymentsService.getAvailableMethods(),
    };
  }

  /**
   * Endpoint dùng để chuyển đổi phương thức thanh toán
   */
  @Post('switch/:orderId')
  @Auth(AuthType.Bearer)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ 
    summary: 'Chuyển đổi phương thức thanh toán',
    description: `
      Thay đổi phương thức thanh toán của đơn hàng (chỉ khi chưa thanh toán).
      
      **Trường hợp sử dụng:**
      - Đặt hàng với COD nhưng muốn chuyển sang QR
      - QR code hết hạn, tạo QR mới
      - Đổi từ QR sang COD vì lý do cá nhân
      
      **Điều kiện:**
      - Đơn hàng đang ở trạng thái PENDING
      - Payment status = PENDING (chưa thanh toán)
      - Là chủ đơn hàng hoặc admin
      
      **Quy trình:**
      1. Xác thực đơn hàng và quyền
      2. Cập nhật phương thức thanh toán
      3. Tạo QR mới nếu chuyển sang SEPAY_QR
      4. Trả về thông tin QR (nếu có)
      
      **Lưu ý:** Chỉ có thể chuyển đổi trong thời gian giới hạn.
    `
  })
  @ApiOkResponse({ 
    description: 'Phương thức thanh toán đã được chuyển đổi thành công.',
    schema: {
      oneOf: [
        {
          type: 'object',
          description: 'Response when switching to QR payment',
          properties: {
            qrCodeUrl: { type: 'string' },
            amount: { type: 'number' },
            accountNumber: { type: 'string' },
            accountName: { type: 'string' },
            bankCode: { type: 'string' }
          }
        },
        {
          type: 'object',
          description: 'Response when switching to COD',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Switched to COD successfully' }
          }
        }
      ]
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Order ID không hợp lệ, phương thức thanh toán không được hỗ trợ, hoặc đơn hàng không thể chuyển đổi.',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Không tìm thấy đơn hàng với ID được cung cấp.',
    type: NotFoundErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi chuyển đổi phương thức thanh toán.',
    type: ErrorResponseDto 
  })
  @ApiParam({ 
    name: 'orderId', 
    description: 'ID của đơn hàng cần chuyển đổi phương thức thanh toán',
    example: '650e8400-e29b-41d4-a716-446655440003',
    format: 'uuid'
  })
  async switchPaymentMethod(
    @Param('orderId', ParseUUIDPipe) orderId: string,
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