import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop ABC 2025' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Mô tả ngắn gọn về cấu hình và ưu điểm' })
  @IsString()
  description: string;

  @ApiProperty({ example: 15990000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ example: '6c3b0e8b-1d43-4d01-9d7b-d5a9ab2e7a3a' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
