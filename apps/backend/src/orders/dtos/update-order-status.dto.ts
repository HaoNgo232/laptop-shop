import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { IUpdateOrderStatus } from '@web-ecom/shared-types/orders/interfaces.cjs';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto implements IUpdateOrderStatus {
  @IsEnum(OrderStatusEnum)
  @IsNotEmpty()
  status: OrderStatusEnum;
}
