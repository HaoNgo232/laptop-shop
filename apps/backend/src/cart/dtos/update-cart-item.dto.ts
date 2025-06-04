import { IsNumber, IsUUID, Min } from 'class-validator';
import { IUpdateCartItem } from '@web-ecom/shared-types';

export class UpdateCartItemDto implements IUpdateCartItem {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;
}
