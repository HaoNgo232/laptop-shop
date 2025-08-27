import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new order
 */
export class CreateOrderDto {
  @ApiProperty({ 
    description: 'Complete shipping address where the order should be delivered',
    example: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    minLength: 10,
    maxLength: 500 
  })
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  @IsString()
  @MinLength(10, { message: 'Địa chỉ giao hàng phải có ít nhất 10 ký tự' })
  @MaxLength(500, { message: 'Địa chỉ giao hàng không được quá 500 ký tự' })
  shippingAddress: string;

  @ApiProperty({ 
    description: 'Payment method for the order',
    enum: PaymentMethodEnum,
    example: PaymentMethodEnum.SEPAY_QR 
  })
  @IsNotEmpty({ message: 'Phương thức thanh toán không được để trống' })
  @IsEnum(PaymentMethodEnum, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod: PaymentMethodEnum;

  @ApiProperty({ 
    description: 'Optional note or special instructions for the order',
    example: 'Giao hàng vào buổi chiều sau 2PM, gọi trước 15 phút',
    required: false,
    maxLength: 1000 
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Ghi chú không được quá 1000 ký tự' })
  note?: string;
}
