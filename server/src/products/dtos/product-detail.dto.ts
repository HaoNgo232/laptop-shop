import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class ProductDetailDto {
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
    example:
      'Điện thoại iPhone 15 Pro Max mới nhất với nhiều tính năng hấp dẫn',
  })
  description: string;

  @ApiProperty({
    description: 'Giá sản phẩm',
    example: 1299.99,
  })
  price: number;

  @ApiProperty({
    description: 'Số lượng sản phẩm trong kho',
    example: 100,
  })
  stock_quantity: number;

  @ApiProperty({
    description: 'URL hình ảnh sản phẩm',
    example: 'https://example.com/images/iphone15.jpg',
  })
  image_url: string;

  @ApiProperty({
    description: 'Thông tin về danh mục',
    type: CategoryDto,
  })
  category: CategoryDto;

  @ApiProperty({
    description: 'Thời gian tạo sản phẩm',
    example: '2023-09-29T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật sản phẩm gần nhất',
    example: '2023-09-30T10:11:12.345Z',
  })
  updatedAt: Date;

  // @ApiProperty({
  //   description: 'Danh sách đánh giá sản phẩm',
  //   type: [ReviewDto]
  // })
  // reviews: ReviewDto[];
}
