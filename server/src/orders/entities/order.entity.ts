import { User } from '@/auth/entities/user.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@Entity('orders')
@Index(['user_id'])
@Index(['order_date'])
@Index(['status'])
export class Order extends BaseEntity {
  @Column({ name: 'user_id' })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'order_date',
  })
  order_date: Date;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total_amount: number;

  @Column('text')
  @IsNotEmpty()
  @IsString()
  shipping_address: string;

  @Column({ length: 50 })
  @IsNotEmpty()
  @IsString()
  payment_method: string;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.PENDING,
  })
  @IsEnum(PaymentStatusEnum)
  payment_status: PaymentStatusEnum;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  note?: string;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: false,
  })
  items: OrderItem[];
}
