import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Extracts the current user from the request object.
 * Can also extract a specific property of the user if a key is provided.
 *
 * @example
 * // Get the whole user object
 * getProfile(@CurrentUser() user: User)
 *
 * // Get a specific property (e.g., user ID)
 * updateProfile(@CurrentUser('id') userId: string)
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();

    const user = request.user;

    if (!user) {
      // Consider throwing an UnauthorizedException if the user should always exist here,
      // for example, if this decorator is only used in routes protected by JwtAuthGuard.
      return null;
    }

    return data ? user[data] : user;
  },
);
