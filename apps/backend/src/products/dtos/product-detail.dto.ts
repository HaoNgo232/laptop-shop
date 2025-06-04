import { CategoryDto } from '@/products/dtos/category.dto';

export class ProductDetailDto {
  id: string;

  name: string;

  description: string;

  price: number;

  stock_quantity: number;

  image_url?: string;

  category: CategoryDto;

  createdAt: Date;

  updatedAt: Date;

  // @ApiProperty({
  //   description: 'Danh sách đánh giá sản phẩm',
  //   type: [ReviewDto]
  // })
  // reviews: ReviewDto[];
}
