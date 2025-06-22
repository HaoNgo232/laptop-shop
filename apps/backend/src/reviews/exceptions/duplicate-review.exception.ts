import { ConflictException } from '@nestjs/common';

export class DuplicateReviewException extends ConflictException {
  constructor(message?: string) {
    super(message || 'Bạn chỉ được đánh giá sản phẩm một lần khi mua!');
  }
}
