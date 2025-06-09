import { Body, Delete, Get, Param, ParseUUIDPipe, Query, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { Controller, Post } from '@nestjs/common';
import { OrdersService } from '@/orders/orders.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { QRCodeResponse } from '@/payment/interfaces/payment-provider.interfaces';

@ApiTags('Orders')
@ApiBearerAuth()
@Auth(AuthType.Bearer, UserRole.USER, UserRole.ADMIN)
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới từ giỏ hàng' })
  @ApiResponse({ status: 201, description: 'Đơn hàng đã được tạo thành công', type: OrderDto })
  async createOrder(
    @CurrentUser('sub') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse }> {
    return await this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  async getUserOrders(
    @CurrentUser('sub') userId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<OrderDto> & { message: string }> {
    const result = await this.ordersService.getUserOrders(userId, query);

    // Tạo message phù hợp
    let message: string;
    if (result.meta.totalItems === 0) {
      message = 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!';
    } else if (result.meta.totalItems === 1) {
      message = 'Bạn có 1 đơn hàng.';
    } else {
      message = `Bạn có ${result.meta.totalItems} đơn hàng.`;
    }

    return {
      ...result,
      message,
    };
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Chi tiết đơn hàng', type: OrderDetailDto })
  async getUserOrderById(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.ordersService.getUserOrderById(userId, orderId);
  }

  @Get(':orderId/check-payment-status')
  @ApiOperation({ summary: 'Kiểm tra trạng thái thanh toán đơn hàng' })
  @ApiResponse({ status: 200, description: 'Trạng thái thanh toán hiện tại', type: OrderDetailDto })
  async checkPaymentStatus(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.ordersService.getUserOrderById(userId, orderId);
  }

  @Delete(':orderId/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiResponse({ status: 200, description: 'Đơn hàng đã được hủy', type: OrderDto })
  async cancelOrder(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDto> {
    return await this.ordersService.cancelUserOrder(userId, orderId);
  }
}
