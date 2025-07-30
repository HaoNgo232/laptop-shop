import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator để lấy thông tin user hiện tại từ JWT token
 * Sử dụng trong controller để inject user đã được authenticate
 *
 * // Lấy toàn bộ user object
 * getProfile(@CurrentUser() user: JwtPayload) { ... }
 *
 * // Chỉ lấy userId
 * getUserOrders(@CurrentUser('sub') userId: string) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    // Lấy request object từ execution context
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();

    // User được inject bởi AuthenticationGuard sau khi verify JWT
    const user = request.user;

    // Return null nếu không có user (không được authenticate)
    if (!user) {
      return null;
    }

    // Return field cụ thể nếu data được chỉ định, ngược lại return toàn bộ user
    return data ? user[data] : user;
  },
);
