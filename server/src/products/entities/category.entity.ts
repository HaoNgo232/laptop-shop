import { Entity, Column, OneToMany } from 'typeorm';
import { Type } from 'class-transformer';
import { Product } from './product.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  // Relationships
  @OneToMany(() => Product, (product) => product.category)
  @Type(() => Product)
  products: Product[];
}
