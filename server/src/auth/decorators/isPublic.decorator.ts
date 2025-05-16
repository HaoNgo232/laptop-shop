import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
// Đánh dấu route là public
// Sử dụng decorator này trong controller để cho phép truy cập mà không cần xác thực
