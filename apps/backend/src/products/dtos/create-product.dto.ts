import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateProductDto {
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
