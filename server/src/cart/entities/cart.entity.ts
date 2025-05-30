import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from '../../auth/entities/user.entity';
import { Type } from 'class-transformer';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Cart extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  user_id: string;

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
  cart_items: CartItem[];
}
