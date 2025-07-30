import { Order } from '@/orders/entities/order.entity';
import { Product } from '@/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@Entity('order_items')
export class OrderItem {
  @PrimaryColumn({ name: 'order_id' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @PrimaryColumn({ name: 'product_id' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Column('int')
  @IsNumber()
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  priceAtPurchase: number;

  // Relationships
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { eager: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
