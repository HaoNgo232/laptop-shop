import { IsString, IsNumber, IsOptional, IsDateString, IsNotEmpty, Min } from 'class-validator';

export class SepayWebhookDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  gateway: string;

  @IsDateString()
  @IsNotEmpty()
  transaction_date: string;

  @IsString()
  @IsNotEmpty()
  account_number: string;

  @IsOptional()
  @IsString()
  sub_account?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount_in: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount_out: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  accumulated: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  bank_brand_name: string;
}
