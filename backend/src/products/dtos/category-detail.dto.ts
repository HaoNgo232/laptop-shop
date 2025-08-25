import { ProductDto } from '@/products/dtos/product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ type: () => [ProductDto] })
  products: ProductDto[];
}
