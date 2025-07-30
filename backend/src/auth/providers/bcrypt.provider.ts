import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingProvider } from '@/auth/providers/hashing.provider';
@Injectable()
export class BcryptProvider implements HashingProvider {
  /**
   * Tạo hash cho mật khẩu.
   */
  public async hashPassword(data: string | Buffer): Promise<string> {
    // Tạo salt và hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  /**
   * So sánh mật khẩu.
   */
  public comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
