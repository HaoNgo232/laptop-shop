import { IResetPasswordPayload } from '@web-ecom/shared-types';

export interface ResetPasswordPayload extends IResetPasswordPayload {
  sub: string;
  type: 'password-reset';
}
