import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { Body, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { UserRole } from '@/auth/enums/user-role.enum';
import { Controller, Patch } from '@nestjs/common';

import { AdminOrdersService } from '@/orders/services/admin-orders.service';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { AdminOrderQueryDto } from '@/orders/dtos/admin-order-query.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { UpdateOrderStatusDto } from '@/orders/dtos/update-order-status.dto';

@Controller('api/admin/orders')
@Auth(AuthType.Bearer, UserRole.ADMIN)
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  async getOrders(@Query() query: AdminOrderQueryDto): Promise<PaginatedResponse<OrderDto>> {
    return await this.adminOrdersService.findAll(query);
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId', ParseUUIDPipe) orderId: string): Promise<OrderDto> {
    return await this.adminOrdersService.findOne(orderId);
  }

  @Patch(':orderId/status')
  async updateOrderStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    return await this.adminOrdersService.updateStatus(orderId, updateStatusDto);
  }
}
