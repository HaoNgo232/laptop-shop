import { CategoryBriefDto } from './category-brief.dto';

export class ProductDto {
  id: string;

  name: string;

  description: string;

  price: number;

  image_url?: string;

  stock_quantity: number;

  category: CategoryBriefDto;

  created_at: Date;

  updated_at: Date;
}
