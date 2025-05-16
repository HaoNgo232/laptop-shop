export interface JwtPayload {
  sub: string; // ID của người dùng
  email: string; // Địa chỉ email của người dùng
  role: string; // Vai trò của người dùng (ví dụ: admin, user)
  iat?: number; // Thời gian tạo token (optional)
  exp?: number; // Thời gian hết hạn của token (optional)
}
