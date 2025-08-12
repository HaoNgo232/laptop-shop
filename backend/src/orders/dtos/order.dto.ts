import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { IsDate, IsEnum, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsDate()
  orderDate: Date;

  @ApiProperty({ enum: OrderStatusEnum })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @ApiProperty({ example: 45990000 })
  @IsNumber()
  @IsPositive()
  totalAmount: number;
}
