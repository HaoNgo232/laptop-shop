import { ProductDto } from '@/products/dtos/product.dto';

export class CategoryDetailDto {
  id: string;

  name: string;

  description?: string;

  products: ProductDto[];
}
