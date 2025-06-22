import { CategoryBriefDto } from '@/products/dtos/category-brief.dto';
import { IProduct } from '@web-ecom/shared-types/products/interfaces.cjs';

export class ProductDto implements IProduct {
  id: string;

  name: string;

  description: string;

  price: number;

  imageUrl: string;

  stockQuantity: number;

  category: CategoryBriefDto;

  active: boolean;

  deletedAt?: Date | null;

  averageRating: number;

  reviewCount: number;

  createdAt: Date;

  updatedAt: Date;
}
