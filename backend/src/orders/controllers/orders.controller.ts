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
import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { OrdersService } from '@/orders/services/orders.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Đơn hàng')
@ApiBearerAuth('Authorization')
@Controller('api/orders')
@Auth(AuthType.Bearer, UserRole.USER, UserRole.ADMIN)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng' })
  @ApiCreatedResponse({ description: 'Tạo đơn hàng thành công. Có thể kèm thông tin QR.' })
  async createOrder(
    @CurrentUser('sub') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse }> {
    return await this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lịch sử đơn hàng' })
  @ApiOkResponse({ description: 'Danh sách đơn hàng của người dùng.' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
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
  @ApiOperation({ summary: 'Chi tiết đơn hàng' })
  @ApiOkResponse({ description: 'Thông tin chi tiết đơn hàng.' })
  @ApiParam({ name: 'orderId', description: 'ID đơn hàng (UUID)' })
  async getUserOrderById(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.ordersService.findOne(userId, orderId);
  }

  @Get(':orderId/check-payment-status')
  @ApiOperation({ summary: 'Kiểm tra trạng thái thanh toán' })
  @ApiOkResponse({ description: 'Trạng thái thanh toán hiện tại của đơn hàng.' })
  @ApiParam({ name: 'orderId', description: 'ID đơn hàng (UUID)' })
  async checkPaymentStatus(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.ordersService.findOne(userId, orderId);
  }

  @Delete(':orderId/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiOkResponse({ description: 'Đơn hàng đã được hủy (nếu đủ điều kiện).' })
  @ApiParam({ name: 'orderId', description: 'ID đơn hàng (UUID)' })
  async cancelOrder(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDto> {
    return await this.ordersService.cancel(userId, orderId);
  }
}
