import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity()
export class TokenBlacklist extends BaseEntity {
  @Column()
  @Index() // Thêm index cho token để tìm kiếm nhanh
  token: string;

  @Column()
  type: 'access' | 'refresh'; // Loại token: access hoặc refresh

  @Column({ type: 'timestamp' })
  @Index() // Thêm index cho expiresAt để dễ dàng loại bỏ token hết hạn
  expiresAt: Date;
}
