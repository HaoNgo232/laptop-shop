import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsEnum, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class OrderDto {
  @ApiProperty({ description: 'ID đơn hàng' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Ngày đặt hàng' })
  @IsDate()
  order_date: Date;

  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    enum: OrderStatusEnum,
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @ApiProperty({ description: 'Tổng tiền đơn hàng' })
  @IsNumber()
  @IsPositive()
  total_amount: number;
}
