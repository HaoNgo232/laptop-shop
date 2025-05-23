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

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock_quantity: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ name: 'category_id' })
  category_id: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // @OneToMany(() => Review, review => review.product)
  // reviews: Review[];
}
