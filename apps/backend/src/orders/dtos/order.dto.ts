import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class OrderDto {
  @ApiProperty({ description: 'ID đơn hàng' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Ngày đặt hàng' })
  @IsDate()
  orderDate: Date;

  @ApiProperty({
    description: 'Trạng thái đơn hàng',
    enum: OrderStatusEnum,
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @ApiProperty({ description: 'Tổng tiền đơn hàng' })
  @IsNumber()
  @IsPositive()
  totalAmount: number;
}
