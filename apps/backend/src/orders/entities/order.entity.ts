import { User } from '@/auth/entities/user.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { OrderStatusEnum } from '@/orders/enums/order-status.enum';
import { PaymentStatusEnum } from '@/orders/enums/payment-status.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethodEnum } from '@/payments/enums/payment-method.enum';

@Entity('orders')
@Index(['userId'])
@Index(['orderDate'])
@Index(['status'])
export class Order extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'order_date',
  })
  orderDate: Date;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
    name: 'status',
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @Column('text')
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
    default: PaymentMethodEnum.SEPAY_QR,
    name: 'payment_method',
  })
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.PENDING,
  })
  @IsEnum(PaymentStatusEnum)
  paymentStatus: PaymentStatusEnum;

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
