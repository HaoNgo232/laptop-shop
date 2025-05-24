import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class CategoryDetailDto {
  @ApiProperty({
    description: 'ID của danh mục',
    example: 'e87b56c6-8b4a-4c7d-b7e3-2c0b94c1c2d1',
  })
  id: string;

  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Điện thoại di động',
  })
  name: string;

  @ApiProperty({
    description: 'Mô tả danh mục',
    example: 'Các sản phẩm điện thoại di động từ nhiều thương hiệu khác nhau',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Danh sách sản phẩm thuộc danh mục',
    type: [ProductDto],
  })
  products: ProductDto[];
}
