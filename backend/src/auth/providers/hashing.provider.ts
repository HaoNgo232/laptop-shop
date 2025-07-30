import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  /**
   * Tạo hash cho mật khẩu.
   */
  abstract hashPassword(data: string | Buffer): Promise<string>;

  /**
   * So sánh mật khẩu.
   */
  abstract comparePassword(data: string | Buffer, encrypted: string): Promise<boolean>;
}
