import { BaseEntity } from '@/common/entities/base.entity';
import { CartItem } from '@/cart/entities/cart-item.entity';
import { Min, MinLength } from 'class-validator';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { Review } from '@/reviews/entities/review.entity';

@Entity('products')
export class Product extends BaseEntity {
  @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
  @Column({ unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Min(0, { message: 'Giá sản phẩm phải lớn hơn 0' })
  price: number;

  @Column('int', { default: 0 })
  stockQuantity: number;

  @Column('int', { default: 0 })
  reservedQuantity: number;

  @Column({ nullable: false })
  imageUrl: string;

  @Column()
  categoryId: string;

  @Column({ default: true })
  active: boolean;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  // Relationships
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
