export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  dropSchema: boolean;
  migrationsRun: boolean;
  migrations: string[];
  cli: {
    migrationsDir: string;
  };
}

export interface JwtConfig {
  secret: string;
  expirationTime: string;
  refreshExpirationTime: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  mailHost: string;
  smtpUsername: string;
  smtpPassword: string;
}
