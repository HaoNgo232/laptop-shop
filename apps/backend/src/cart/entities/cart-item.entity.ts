import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from '@/cart/entities/cart.entity';
import { Product } from '@/products/entities/product.entity';

@Entity('cart_items')
@Check('quantity > 0')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ type: 'uuid' })
  cart_id: string;

  @PrimaryColumn({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Giá sản phẩm tại thời điểm thêm vào giỏ hàng',
  })
  price_at_addition: number;

  @CreateDateColumn()
  added_at: Date;

  // Relationships
  @ManyToOne(() => Cart, (cart) => cart.cart_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cart_items)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
