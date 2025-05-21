import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'iPhone 15 Pro Max',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example:
      'Điện thoại iPhone 15 Pro Max mới nhất với nhiều tính năng hấp dẫn',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Giá sản phẩm',
    example: 1299.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Số lượng sản phẩm trong kho',
    example: 100,
  })
  @IsNumber()
  @Min(0)
  stock_quantity: number;

  @ApiProperty({
    description: 'URL hình ảnh sản phẩm',
    example: 'https://example.com/images/iphone15.jpg',
    required: false,
  })
  @IsUrl()
  image_url: string;

  @ApiProperty({
    description: 'ID của danh mục sản phẩm',
    example: 'e87b56c6-8b4a-4c7d-b7e3-2c0b94c1c2d1',
  })
  @IsUUID()
  @IsNotEmpty()
  category_id: string;
}
