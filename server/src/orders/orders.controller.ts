import { Controller, Get, Post, Patch, Param, Body, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderDto } from './dtos/order.dto';
import { OrderDetailDto } from './dtos/order-detail.dto';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
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
  ): Promise<PaginatedResponse<OrderDto>> {
    return await this.ordersService.getUserOrders(userId, query);
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

  @Patch(':orderId/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiResponse({ status: 200, description: 'Đơn hàng đã được hủy', type: OrderDto })
  async cancelOrder(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDto> {
    return await this.ordersService.cancelUserOrder(userId, orderId);
  }
}
