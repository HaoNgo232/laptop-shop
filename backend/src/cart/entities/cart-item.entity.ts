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
  cartId: string;

  @PrimaryColumn({ type: 'uuid' })
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Giá sản phẩm tại thời điểm thêm vào giỏ hàng',
  })
  priceAtAddition: number;

  @CreateDateColumn()
  addedAt: Date;

  // Relationships
  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
