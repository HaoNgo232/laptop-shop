import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethodEnum } from '@/payment/enums/payment-method.enum';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
  })
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  @IsString()
  @MinLength(10, { message: 'Địa chỉ giao hàng phải có ít nhất 10 ký tự' })
  @MaxLength(500, { message: 'Địa chỉ giao hàng không được quá 500 ký tự' })
  shippingAddress: string;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    enum: PaymentMethodEnum,
    example: PaymentMethodEnum.SEPAY_QR,
  })
  @IsNotEmpty({ message: 'Phương thức thanh toán không được để trống' })
  @IsEnum(PaymentMethodEnum, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod: PaymentMethodEnum;

  @ApiPropertyOptional({
    description: 'Ghi chú đơn hàng',
    example: 'Giao hàng ngoài giờ hành chính',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Ghi chú không được quá 1000 ký tự' })
  note?: string;
}
