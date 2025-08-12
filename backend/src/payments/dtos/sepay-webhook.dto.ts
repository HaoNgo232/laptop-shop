import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsDateString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SepayWebhookDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gateway: string;

  @ApiProperty({ example: '2025-08-12T12:34:56+07:00' })
  @IsDateString()
  @IsNotEmpty()
  transactionDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subAccount?: string;

  @ApiProperty({ enum: ['in', 'out'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['in', 'out'])
  transferType: 'in' | 'out';

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  transferAmount: number;

  @ApiProperty({ example: 1500000 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  accumulated: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referenceCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
