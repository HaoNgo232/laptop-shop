import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { PaymentMethodEnum } from '@/payments/enums/payment-method.enum';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  @IsString()
  @MinLength(10, { message: 'Địa chỉ giao hàng phải có ít nhất 10 ký tự' })
  @MaxLength(500, { message: 'Địa chỉ giao hàng không được quá 500 ký tự' })
  shippingAddress: string;

  @IsNotEmpty({ message: 'Phương thức thanh toán không được để trống' })
  @IsEnum(PaymentMethodEnum, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod: PaymentMethodEnum;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Ghi chú không được quá 1000 ký tự' })
  note?: string;
}
