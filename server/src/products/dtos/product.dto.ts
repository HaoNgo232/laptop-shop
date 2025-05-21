import { ApiProperty } from '@nestjs/swagger';
import { CategoryBriefDto } from './category-brief.dto';

export class ProductDto {
  @ApiProperty({
    description: 'ID của sản phẩm',
    example: 'f0a0a2b4-c5c6-4d7e-8f9a-0b1c2d3e4f5g',
  })
  id: string;

  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'iPhone 15 Pro Max',
  })
  name: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example: 'Điện thoại thông minh cao cấp với camera 48MP',
  })
  description: string;

  @ApiProperty({
    description: 'Giá sản phẩm',
    example: 1299.99,
  })
  price: number;

  @ApiProperty({
    description: 'URL hình ảnh sản phẩm',
    example: 'https://example.com/images/iphone15.jpg',
  })
  image_url: string;

  @ApiProperty({
    description: 'Số lượng tồn kho',
    example: 100,
  })
  stock_quantity: number;

  @ApiProperty({
    description: 'Thông tin ngắn gọn về danh mục',
    type: CategoryBriefDto,
  })
  category: CategoryBriefDto;

  @ApiProperty({
    description: 'Thời gian tạo sản phẩm',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật sản phẩm gần nhất',
    example: '2023-01-10T00:00:00Z',
  })
  updatedAt: Date;
}
