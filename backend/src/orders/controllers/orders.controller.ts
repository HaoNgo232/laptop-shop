import { Body, Delete, Get, Param, ParseUUIDPipe, Query, HttpStatus } from '@nestjs/common';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { Controller, Post } from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';
import { PaginatedResponseDto } from '@/common/dtos/paginated-response.dto';
import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { OrdersService } from '@/orders/services/orders.service';
import { 
  ValidationErrorResponseDto, 
  UnauthorizedErrorResponseDto, 
  NotFoundErrorResponseDto,
  ErrorResponseDto 
} from '@/common/dtos/api-response.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('📋 Orders')
@ApiExtraModels(OrderDto, CreateOrderDto, OrderDetailDto, PaginatedResponseDto, ValidationErrorResponseDto, UnauthorizedErrorResponseDto, NotFoundErrorResponseDto, ErrorResponseDto)
@ApiBearerAuth('Authorization')
@Controller('api/orders')
@Auth(AuthType.Bearer, UserRole.USER, UserRole.ADMIN)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Tạo đơn hàng mới',
    description: `
      Tạo đơn hàng mới từ giỏ hàng của người dùng.
      
      **Quy trình:**
      1. Kiểm tra giỏ hàng có sản phẩm không
      2. Xác nhận tồn kho đủ cho tất cả sản phẩm
      3. Đặt trước tồn kho (reserved stock)
      4. Tạo đơn hàng với trạng thái PENDING
      5. Xóa giỏ hàng sau khi tạo đơn thành công
      6. Tạo QR code nếu chọn thanh toán SEPAY_QR
      
      **Phương thức thanh toán:**
      - **COD:** Thanh toán khi nhận hàng
      - **SEPAY_QR:** Thanh toán qua QR code (trả về thông tin QR)
      
      **Lưu ý:** Tồn kho sẽ được đặt trước trong 15 phút. Nếu không thanh toán, đơn hàng sẽ bị hủy tự động.
    `
  })
  @ApiCreatedResponse({ 
    description: 'Đơn hàng đã được tạo thành công. Có thể kèm thông tin QR code cho thanh toán.',
    schema: {
      type: 'object',
      properties: {
        order: { $ref: '#/components/schemas/OrderDto' },
        qrCode: { 
          type: 'object',
          properties: {
            qrCodeUrl: { type: 'string', example: 'https://qr.sepay.vn/img?acc=1234567890&bank=VCB&amount=15990000&des=DH650e8400' },
            amount: { type: 'number', example: 15990000 },
            accountNumber: { type: 'string', example: '1234567890' },
            accountName: { type: 'string', example: 'LAPTOP SHOP' },
            bankCode: { type: 'string', example: 'VCB' }
          }
        }
      },
      required: ['order']
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Giỏ hàng trống, địa chỉ không hợp lệ, hoặc không đủ tồn kho.',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi tạo đơn hàng hoặc tạo QR code.',
    type: ErrorResponseDto 
  })
  async createOrder(
    @CurrentUser('sub') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse }> {
    return await this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lịch sử đơn hàng của người dùng',
    description: `
      Lấy danh sách tất cả đơn hàng của người dùng đã đăng nhập.
      
      **Tính năng:**
      - Phân trang với page và limit
      - Sắp xếp theo thời gian tạo (mới nhất trước)
      - Hiển thị thông tin tóm tắt của từng đơn hàng
      
      **Thông tin bao gồm:**
      - ID đơn hàng và ngày đặt
      - Trạng thái đơn hàng và thanh toán
      - Tổng tiền và phương thức thanh toán
      - Địa chỉ giao hàng
      
      **Phân trang:** Mặc định 10 đơn hàng/trang, tối đa 50.
    `
  })
  @ApiOkResponse({ 
    description: 'Danh sách đơn hàng của người dùng được trả về thành công.',
    type: PaginatedResponseDto<OrderDto>
  })
  @ApiBadRequestResponse({ 
    description: 'Tham số phân trang không hợp lệ (page, limit).',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi truy xuất danh sách đơn hàng.',
    type: ErrorResponseDto 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Trang hiện tại (mặc định 1)',
    example: 1,
    schema: { type: 'integer', minimum: 1 }
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Số đơn hàng mỗi trang (mặc định 10, tối đa 50)',
    example: 10,
    schema: { type: 'integer', minimum: 1, maximum: 50 }
  })
  async getUserOrders(
    @CurrentUser('sub') userId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<OrderDto> & { message: string }> {
    const result = await this.ordersService.findAll(userId, query);

    return {
      ...result,
      message: result.message,
    };
  }

  @Get(':orderId')
  @ApiOperation({ 
    summary: 'Chi tiết đơn hàng',
    description: `
      Lấy thông tin chi tiết của một đơn hàng cụ thể.
      
      **Thông tin chi tiết bao gồm:**
      - Thông tin đơn hàng (ID, ngày, trạng thái, tổng tiền)
      - Thông tin khách hàng (tên, email)
      - Danh sách sản phẩm với số lượng và giá
      - Địa chỉ giao hàng và ghi chú
      - Phương thức thanh toán và transaction ID
      - Timestamps (tạo, cập nhật)
      
      **Bảo mật:** Chỉ chủ đơn hàng hoặc admin mới có thể xem chi tiết.
    `
  })
  @ApiOkResponse({ 
    description: 'Thông tin chi tiết đơn hàng được trả về thành công.',
    type: OrderDetailDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Order ID không đúng định dạng UUID.',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiForbiddenResponse({ 
    description: 'Không có quyền xem đơn hàng này (chỉ chủ đơn hàng hoặc admin).',
    type: ErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Không tìm thấy đơn hàng với ID được cung cấp.',
    type: NotFoundErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi truy xuất thông tin đơn hàng.',
    type: ErrorResponseDto 
  })
  @ApiParam({ 
    name: 'orderId', 
    description: 'ID của đơn hàng cần xem chi tiết',
    example: '650e8400-e29b-41d4-a716-446655440003',
    format: 'uuid'
  })
  async getUserOrderById(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.ordersService.findOne(userId, orderId);
  }

  @Get(':orderId/check-payment-status')
  @ApiOperation({ 
    summary: 'Kiểm tra trạng thái thanh toán',
    description: `
      Kiểm tra trạng thái thanh toán hiện tại của đơn hàng.
      
      **Sử dụng khi:**
      - Người dùng vừa thanh toán qua QR code
      - Muốn kiểm tra xem payment đã được xử lý chưa
      - Polling để cập nhật UI real-time
      
      **Trạng thái có thể:**
      - PENDING: Chưa thanh toán
      - PAID: Đã thanh toán thành công  
      - FAILED: Thanh toán thất bại
      - CANCELLED: Đã hủy thanh toán
      
      **Lưu ý:** Endpoint này trả về thông tin đầy đủ của đơn hàng, không chỉ trạng thái thanh toán.
    `
  })
  @ApiOkResponse({ 
    description: 'Trạng thái thanh toán và thông tin đơn hàng hiện tại.',
    type: OrderDetailDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Order ID không đúng định dạng UUID.',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiForbiddenResponse({ 
    description: 'Không có quyền kiểm tra đơn hàng này.',
    type: ErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Không tìm thấy đơn hàng với ID được cung cấp.',
    type: NotFoundErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi kiểm tra trạng thái thanh toán.',
    type: ErrorResponseDto 
  })
  @ApiParam({ 
    name: 'orderId', 
    description: 'ID của đơn hàng cần kiểm tra trạng thái thanh toán',
    example: '650e8400-e29b-41d4-a716-446655440003',
    format: 'uuid'
  })
  async checkPaymentStatus(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.ordersService.findOne(userId, orderId);
  }

  @Delete(':orderId/cancel')
  @ApiOperation({ 
    summary: 'Hủy đơn hàng',
    description: `
      Hủy đơn hàng nếu đủ điều kiện.
      
      **Điều kiện hủy:**
      - Đơn hàng đang ở trạng thái PENDING
      - Chưa thanh toán (paymentStatus = PENDING)
      - Là chủ đơn hàng hoặc admin
      
      **Quy trình:**
      1. Kiểm tra điều kiện hủy
      2. Hoàn trả tồn kho (unreserve stock)
      3. Cập nhật trạng thái thành CANCELLED
      4. Gửi email thông báo (nếu có)
      
      **Lưu ý:** Không thể hủy đơn hàng đã thanh toán hoặc đang xử lý.
    `
  })
  @ApiOkResponse({ 
    description: 'Đơn hàng đã được hủy thành công.',
    type: OrderDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Order ID không hợp lệ hoặc đơn hàng không thể hủy (đã thanh toán/đang xử lý).',
    type: ValidationErrorResponseDto 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Người dùng chưa đăng nhập hoặc token không hợp lệ.',
    type: UnauthorizedErrorResponseDto 
  })
  @ApiForbiddenResponse({ 
    description: 'Không có quyền hủy đơn hàng này.',
    type: ErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Không tìm thấy đơn hàng với ID được cung cấp.',
    type: NotFoundErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lỗi server khi hủy đơn hàng.',
    type: ErrorResponseDto 
  })
  @ApiParam({ 
    name: 'orderId', 
    description: 'ID của đơn hàng cần hủy',
    example: '650e8400-e29b-41d4-a716-446655440003',
    format: 'uuid'
  })
  async cancelOrder(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDto> {
    return await this.ordersService.cancel(userId, orderId);
  }
}
