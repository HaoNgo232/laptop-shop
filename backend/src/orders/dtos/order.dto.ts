import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { IsDate, IsEnum, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class OrderDto {
  @IsUUID()
  id: string;

  @IsDate()
  orderDate: Date;

  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @IsNumber()
  @IsPositive()
  totalAmount: number;
}
