import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expirationTime: process.env.JWT_EXPIRATION_TIME ?? '3600s',
  refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME ?? '7d',
}));
