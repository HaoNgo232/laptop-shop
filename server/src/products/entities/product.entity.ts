import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

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
