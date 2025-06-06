export interface SuccessWebhookResponse {
  success: boolean;
  message: string;
  transactionId: string;
  orderId: string;
  status: 'success' | 'failed' | 'pending';
  error?: undefined;
}

export interface FailedWebhookResponse {
  success: boolean;
  message: string;
  error: any;
  transactionId?: undefined;
  orderId?: undefined;
  status?: undefined;
}
