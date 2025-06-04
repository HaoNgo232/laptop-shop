import { ApiProperty } from '@nestjs/swagger';
import { ICategory } from '@web-ecom/shared-types';

export class CategoryDto implements ICategory {
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
    description: 'Thời gian tạo',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
