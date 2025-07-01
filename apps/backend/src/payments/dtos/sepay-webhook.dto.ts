import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsDateString, IsNotEmpty, IsIn } from 'class-validator';

export class SepayWebhookDto {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  gateway: string;

  @IsDateString()
  @IsNotEmpty()
  transactionDate: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsOptional()
  @IsString()
  subAccount?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['in', 'out'])
  transferType: 'in' | 'out';

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  transferAmount: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  accumulated: number;

  @IsOptional()
  @IsString()
  code?: string; // This is the order ID parsed by SePay

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  referenceCode?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
