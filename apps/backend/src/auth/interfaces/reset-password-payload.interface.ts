export interface ResetPasswordPayload {
  sub: string; // user ID
  type: string; // token type (password-reset)
  iat?: number; // issued at
  exp?: number; // expiration time
}
