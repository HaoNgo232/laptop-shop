import { IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;
}
