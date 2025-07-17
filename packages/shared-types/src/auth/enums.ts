export enum AuthType {
  Bearer = "Bearer",
  None = "None",
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum UserRankEnum {
  BRONZE = "BRONZE", // Giảm 0%
  SILVER = "SILVER", // Giảm 5%
  GOLD = "GOLD", // Giảm 10%
  DIAMOND = "DIAMOND", // Giảm 20%
}
