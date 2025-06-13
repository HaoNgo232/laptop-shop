import { ICreateProduct } from '@web-ecom/shared-types/products/interfaces.cjs';
import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID, Min } from 'class-validator';

export class CreateProductDto implements ICreateProduct {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsUrl()
  imageUrl: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
