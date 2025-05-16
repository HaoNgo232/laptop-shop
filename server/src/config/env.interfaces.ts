export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JwtConfig {
  secret: string;
  expirationTime: number;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
}
