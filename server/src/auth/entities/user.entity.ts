import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user.role';
import { IsEmail, IsNumber, IsString } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  @IsString({ message: 'Họ tên không hợp lệ' })
  full_name: string;

  @Column({ nullable: true })
  @IsString({ message: 'Địa chỉ không hợp lệ' })
  address?: string;

  @Column({ nullable: true })
  @IsNumber({}, { message: 'Số điện thoại không hợp lệ' })
  phone_number?: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // // Relationships
  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];

  // @OneToMany(() => Review, (review) => review.user)
  // reviews: Review[];

  // @OneToOne(() => Cart, (cart) => cart.user)
  // cart: Cart;
}
