import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ProductBriefDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image_url: string;
}
