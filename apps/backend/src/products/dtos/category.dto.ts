import { ICategory } from '@web-ecom/shared-types/products/interfaces.cjs';

export class CategoryDto implements ICategory {
  id: string;

  name: string;

  description?: string;

  createdAt: Date;

  updatedAt: Date;
}
