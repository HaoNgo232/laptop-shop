import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { Body, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { UserRole } from '@/auth/enums/user-role.enum';
import { Controller, Patch } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from '@/orders/orders.service';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { AdminOrderQueryDto } from '@/orders/dtos/admin-order-query.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { UpdateOrderStatusDto } from '@/orders/dtos/update-order-status.dto';

@ApiTags('Admin Orders')
@ApiBearerAuth()
@Auth(AuthType.Bearer, UserRole.ADMIN)
@Controller('api/admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả đơn hàng (Admin)' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  async getOrders(@Query() query: AdminOrderQueryDto): Promise<PaginatedResponse<OrderDto>> {
    return await this.ordersService.getOrders(query);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng (Admin)' })
  @ApiResponse({ status: 200, description: 'Chi tiết đơn hàng', type: OrderDetailDto })
  async getOrderById(@Param('orderId', ParseUUIDPipe) orderId: string): Promise<OrderDetailDto> {
    return await this.ordersService.getOrderById(orderId);
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng (Admin)' })
  @ApiResponse({ status: 200, description: 'Trạng thái đơn hàng đã được cập nhật', type: OrderDto })
  async updateOrderStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    return await this.ordersService.updateOrderStatus(orderId, updateStatusDto);
  }
}
