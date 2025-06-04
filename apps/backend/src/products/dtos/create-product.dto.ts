import { ICreateProduct } from '@web-ecom/shared-types';
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
  stock_quantity: number;

  @IsUrl()
  image_url: string;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;
}
