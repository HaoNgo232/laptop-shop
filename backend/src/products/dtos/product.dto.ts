import { CategoryBriefDto } from '@/products/dtos/category-brief.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Product response DTO with complete product information
 */
export class ProductDto {
  @ApiProperty({ 
    description: 'Unique product identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Product name/title',
    example: 'MacBook Pro M3 16-inch 2024',
    maxLength: 255 
  })
  name: string;

  @ApiProperty({ 
    description: 'Detailed product description',
    example: 'Laptop MacBook Pro 16-inch với chip M3 Pro, 18GB RAM, 512GB SSD. Màn hình Liquid Retina XDR 16.2 inch, độ phân giải 3456x2234 pixels.',
    maxLength: 2000 
  })
  description: string;

  @ApiProperty({ 
    description: 'Product price in Vietnamese Dong (VND)',
    example: 15990000,
    minimum: 0 
  })
  price: number;

  @ApiProperty({ 
    description: 'Product main image URL',
    example: 'https://cdn.example.com/products/macbook-pro-m3-16.jpg',
    format: 'url' 
  })
  imageUrl: string;

  @ApiProperty({ 
    description: 'Available stock quantity',
    example: 25,
    minimum: 0 
  })
  stockQuantity: number;

  @ApiProperty({ 
    description: 'Reserved stock quantity (pending orders)',
    example: 3,
    minimum: 0,
    required: false 
  })
  reservedQuantity?: number;

  @ApiProperty({ 
    description: 'Product category information',
    type: () => CategoryBriefDto 
  })
  category: CategoryBriefDto;

  @ApiProperty({ 
    description: 'Whether the product is active for sale',
    example: true 
  })
  active: boolean;

  @ApiProperty({ 
    description: 'Soft delete timestamp (null if not deleted)',
    example: null,
    nullable: true,
    required: false 
  })
  deletedAt?: Date | null;

  @ApiProperty({ 
    description: 'Average customer rating (1-5 stars)',
    example: 4.5,
    minimum: 0,
    maximum: 5 
  })
  averageRating: number;

  @ApiProperty({ 
    description: 'Total number of customer reviews',
    example: 127,
    minimum: 0 
  })
  reviewCount: number;

  @ApiProperty({ 
    description: 'Product creation timestamp',
    example: '2025-08-27T10:30:00.000Z',
    format: 'date-time' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last product update timestamp',
    example: '2025-08-27T11:45:00.000Z',
    format: 'date-time' 
  })
  updatedAt: Date;
}
