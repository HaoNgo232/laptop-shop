import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { PaymentMethodEnum } from '@/payments/enums/payments-method.enum';

export class CreatePaymentDto {
  @IsString()
  orderId: string;

  @IsNumber()
  @Min(1000) // Minimum 1,000 VND
  amount: number;

  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsOptional()
  @IsString()
  bankAccount?: string;

  @IsOptional()
  @IsNumber()
  expireMinutes?: number = 15; // Default 15 minutes
}
