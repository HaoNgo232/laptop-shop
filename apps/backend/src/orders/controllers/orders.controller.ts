import { Body, Delete, Get, Param, ParseUUIDPipe, Query, HttpStatus } from '@nestjs/common';
import { Auth } from '@/auth/decorators/auth.decorator';
import { AuthType } from '@/auth/enums/auth-type.enum';
import { UserRole } from '@/auth/enums/user-role.enum';
import { Controller, Post } from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CreateOrderDto } from '@/orders/dtos/create-order.dto';
import { OrderDto } from '@/orders/dtos/order.dto';
import { PaginationQueryDto } from '@/orders/dtos/pagination-query.dto';
import { PaginatedResponse } from '@/products/interfaces/paginated-response.interface';
import { OrderDetailDto } from '@/orders/dtos/order-detail.dto';
import { QRCodeResponse } from '@/payments/interfaces/payment-provider.interfaces';
import { UsersOrdersService } from '@/orders/services/users-orders.service';

@Controller('api/orders')
@Auth(AuthType.Bearer, UserRole.USER, UserRole.ADMIN)
export class OrdersController {
  constructor(private readonly usersOrdersService: UsersOrdersService) {}

  @Post()
  async createOrder(
    @CurrentUser('sub') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ order: OrderDto; qrCode?: QRCodeResponse }> {
    return await this.usersOrdersService.create(userId, createOrderDto);
  }

  @Get()
  async getUserOrders(
    @CurrentUser('sub') userId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<OrderDto> & { message: string }> {
    const result = await this.usersOrdersService.findAll(userId, query);

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
  async getUserOrderById(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.usersOrdersService.findOne(userId, orderId);
  }

  @Get(':orderId/check-payment-status')
  async checkPaymentStatus(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDetailDto> {
    return await this.usersOrdersService.findOne(userId, orderId);
  }

  @Delete(':orderId/cancel')
  async cancelOrder(
    @CurrentUser('sub') userId: string,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDto> {
    return await this.usersOrdersService.cancel(userId, orderId);
  }
}
