import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class TokenBlacklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index() // Thêm index cho token để tìm kiếm nhanh
  token: string;

  @Column()
  type: 'access' | 'refresh'; // Loại token: access hoặc refresh

  @Column({ type: 'timestamp' })
  @Index() // Thêm index cho expiresAt để dễ dàng loại bỏ token hết hạn
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
