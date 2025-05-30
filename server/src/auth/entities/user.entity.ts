import { Column, Entity, OneToOne } from 'typeorm';
import { UserRole } from '../enums/user-role';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Cart } from '../../cart/entities/cart.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @Column()
  password_hash: string;

  @Column({ unique: true, length: 20, nullable: true })
  @IsString({ message: 'Tên người dùng không hợp lệ' })
  @MinLength(6, { message: 'Tên người dùng phải có ít nhất 6 ký tự' })
  username?: string;

  @Column({ nullable: true, length: 500 })
  @IsString({ message: 'Địa chỉ không hợp lệ' })
  address?: string;

  @Column({ nullable: true })
  @IsString({ message: 'Số điện thoại không hợp lệ' })
  phone_number?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  // // Relationships
  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];

  // @OneToMany(() => Review, (review) => review.user)
  // reviews: Review[];

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;
}
