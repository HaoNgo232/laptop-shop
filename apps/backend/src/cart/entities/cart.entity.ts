import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from '@/cart/entities/cart-item.entity';
import { Type } from 'class-transformer';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/auth/entities/user.entity';

@Entity()
export class Cart extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  userId: string;

  // Relationships
  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id' })
  @Type(() => User)
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: false,
  })
  @Type(() => CartItem)
  cartItems: CartItem[];
}
