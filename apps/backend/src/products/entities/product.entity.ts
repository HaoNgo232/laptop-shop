import { BaseEntity } from '@/common/entities/base.entity';
import { CartItem } from '@/cart/entities/cart-item.entity';
import { Min, MinLength } from 'class-validator';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';

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

  @Column('int')
  stock_quantity: number;

  @Column({ nullable: true })
  image_url?: string;

  @Column({ name: 'category_id' })
  category_id: string;

  // Relationships
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cart_items: CartItem[];

  // @OneToMany(() => Review, review => review.product)
  // reviews: Review[];

  // @OneToMany(() => OrderItem, orderItem => orderItem.product)
  // order_items: OrderItem[];

  // @OneToMany(() => StockMovement, stockMovement => stockMovement.product)
  // stock_movements: StockMovement[];
}
