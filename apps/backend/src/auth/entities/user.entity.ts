import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { IsEmail, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { Cart } from '@/cart/entities/cart.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { UserRole } from '@/auth/enums/user-role.enum';
import { Order } from '@/orders/entities/order.entity';
import { Review } from '@/reviews/entities/review.entity';
import { UserRankEnum } from '@/orders/enums/user-rank.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true, length: 20, nullable: false })
  @IsString({ message: 'Tên người dùng không hợp lệ' })
  @MinLength(6, { message: 'Tên người dùng phải có ít nhất 6 ký tự' })
  username: string;

  @Column({ nullable: true, length: 500 })
  @IsString({ message: 'Địa chỉ không hợp lệ' })
  address?: string;

  @Column({ nullable: true })
  @IsString({ message: 'Số điện thoại không hợp lệ' })
  phoneNumber?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ type: 'enum', enum: UserRankEnum, default: UserRankEnum.BRONZE })
  rank: UserRankEnum;

  @Column({
    type: 'decimal',
    precision: 12, // 10 chữ số
    scale: 2, // 2 chữ số sau dấu phẩy
    default: 0,
    comment: 'Tổng số tiền đã chi tiêu (VND)',
  })
  totalSpent: number;

  // Relationships
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;
}
