import { IsString, IsNumber, IsOptional, IsUrl, IsNotEmpty, Min } from 'class-validator';

export class ProductBriefDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  image_url?: string;
}
