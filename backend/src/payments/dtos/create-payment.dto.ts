import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID đơn hàng' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(1000) // Minimum 1,000 VND
  amount: number;

  @ApiProperty({ enum: PaymentMethodEnum })
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @ApiProperty({ required: false, description: 'Ghi đè số tài khoản ngân hàng (nếu có)' })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiProperty({ required: false, example: 15 })
  @IsOptional()
  @IsNumber()
  expireMinutes?: number = 15; // Default 15 minutes
}
