export interface WebhookResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  orderId?: string;
  status?: 'success' | 'failed' | 'pending';
  error?: any;
}
