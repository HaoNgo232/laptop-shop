import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { Body, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { UserRole } from '@/auth/enums/user-role.enum';
import { Controller, Patch } from '@nestjs/common';

import { AdminOrdersService } from '@/orders/services/admin-orders.service';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';
import { AdminOrderQueryDto } from '@/orders/dtos/admin-order-query.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { UpdateOrderStatusDto } from '@/orders/dtos/update-order-status.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin - Đơn hàng')
@ApiBearerAuth('Authorization')
@Controller('api/admin/orders')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách đơn hàng (admin)' })
  @ApiOkResponse({ description: 'Danh sách đơn hàng theo bộ lọc/phân trang.' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getOrders(@Query() query: AdminOrderQueryDto): Promise<PaginatedResponse<OrderDto>> {
    return await this.adminOrdersService.findAll(query);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Chi tiết đơn hàng (admin)' })
  @ApiOkResponse({ description: 'Thông tin chi tiết đơn hàng.' })
  @ApiParam({ name: 'orderId', description: 'ID đơn hàng (UUID)' })
  async getOrderById(@Param('orderId', ParseUUIDPipe) orderId: string): Promise<OrderDto> {
    return await this.adminOrdersService.findOne(orderId);
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  @ApiOkResponse({ description: 'Cập nhật trạng thái đơn hàng thành công.' })
  @ApiParam({ name: 'orderId', description: 'ID đơn hàng (UUID)' })
  async updateOrderStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    return await this.adminOrdersService.updateStatus(orderId, updateStatusDto);
  }
}
