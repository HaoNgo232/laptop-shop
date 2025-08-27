import { IsString, IsNumber, IsEnum, IsOptional, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating payment (QR code generation)
 */
export class CreatePaymentDto {
  @ApiProperty({ 
    description: 'ID of the order to create payment for',
    example: '650e8400-e29b-41d4-a716-446655440003',
    format: 'uuid' 
  })
  @IsUUID(4, { message: 'Order ID phải là UUID hợp lệ' })
  @IsString()
  orderId: string;

  @ApiProperty({ 
    description: 'Payment amount in Vietnamese Dong (VND)',
    example: 15990000,
    minimum: 1000,
    maximum: 999999999 
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Số tiền phải là số' })
  @Min(1000, { message: 'Số tiền tối thiểu là 1,000 VND' })
  @Max(999999999, { message: 'Số tiền tối đa là 999,999,999 VND' })
  amount: number;

  @ApiProperty({ 
    description: 'Payment method for the transaction',
    enum: PaymentMethodEnum,
    example: PaymentMethodEnum.SEPAY_QR 
  })
  @IsEnum(PaymentMethodEnum, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod: PaymentMethodEnum;

  @ApiProperty({ 
    description: 'Override bank account number (optional, uses system default if not provided)',
    example: '1234567890',
    required: false,
    maxLength: 20 
  })
  @IsOptional()
  @IsString({ message: 'Số tài khoản ngân hàng phải là chuỗi' })
  bankAccount?: string;

  @ApiProperty({ 
    description: 'QR code expiration time in minutes',
    example: 15,
    minimum: 1,
    maximum: 60,
    required: false,
    default: 15 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Thời gian hết hạn phải là số' })
  @Min(1, { message: 'Thời gian hết hạn tối thiểu là 1 phút' })
  @Max(60, { message: 'Thời gian hết hạn tối đa là 60 phút' })
  expireMinutes?: number = 15;
}
