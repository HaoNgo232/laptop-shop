import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { IsDate, IsEnum, IsNumber, IsPositive, IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Order summary DTO for order listing
 */
export class OrderDto {
  @ApiProperty({ 
    description: 'Unique order identifier',
    example: '650e8400-e29b-41d4-a716-446655440003',
    format: 'uuid' 
  })
  @IsUUID()
  id: string;

  @ApiProperty({ 
    description: 'Order creation date and time',
    example: '2025-08-27T10:30:00.000Z',
    format: 'date-time' 
  })
  @IsDate()
  orderDate: Date;

  @ApiProperty({ 
    description: 'Current order status',
    enum: OrderStatusEnum,
    example: OrderStatusEnum.PENDING 
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @ApiProperty({ 
    description: 'Payment status of the order',
    enum: PaymentStatusEnum,
    example: PaymentStatusEnum.PENDING 
  })
  @IsEnum(PaymentStatusEnum)
  paymentStatus: PaymentStatusEnum;

  @ApiProperty({ 
    description: 'Total order amount in Vietnamese Dong (VND)',
    example: 45990000,
    minimum: 0 
  })
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @ApiProperty({ 
    description: 'Shipping address for the order',
    example: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    maxLength: 500 
  })
  @IsString()
  shippingAddress: string;

  @ApiProperty({ 
    description: 'Payment method used',
    example: 'SEPAY_QR',
    enum: ['COD', 'SEPAY_QR'] 
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ 
    description: 'Optional order notes from customer',
    example: 'Giao hàng vào buổi chiều',
    required: false,
    maxLength: 1000 
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ 
    description: 'Transaction ID from payment provider',
    example: 'TXN_20250827_123456',
    required: false 
  })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
