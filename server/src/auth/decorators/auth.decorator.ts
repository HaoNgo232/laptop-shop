import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { AuthType } from './../enums/auth-type.enum';
import { SetMetadata } from '@nestjs/common';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
