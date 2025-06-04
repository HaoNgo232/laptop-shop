import { CategoryBriefDto } from '@/products/dtos/category-brief.dto';

export class ProductDto {
  id: string;

  name: string;

  description: string;

  price: number;

  image_url?: string;

  stock_quantity: number;

  category: CategoryBriefDto;

  createdAt: Date;

  updatedAt: Date;
}
