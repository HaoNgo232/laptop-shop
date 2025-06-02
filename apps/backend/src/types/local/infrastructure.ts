// ❌ LOCAL BACKEND - Infrastructure-specific types

// Database connection
export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

// Service providers
export interface PaymentProviderConfig {
  apiKey: string;
  secretKey: string;
  webhookSecret: string;
  environment: 'sandbox' | 'production';
  baseUrl: string;
}

// Queue jobs
export interface PaymentProcessingJob {
  id: string;
  paymentId: string;
  attempts: number;
  maxAttempts: number;
  nextRetry?: Date;
  errors: string[];
}

// Middleware context
export interface RequestContext {
  userId?: string;
  requestId: string;
  startTime: Date;
  userAgent?: string;
  ipAddress?: string;
}

// Repository patterns
export interface PaymentRepository {
  create(payment: any): Promise<any>;
  findById(id: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}
