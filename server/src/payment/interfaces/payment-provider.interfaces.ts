export interface PaymentProvider {
  readonly name: string;
  generateQRCode(orderInfo: QRGenerationRequest): Promise<QRCodeResponse>;
  verifyWebhook(payload: any, signature?: string): boolean;
  processTransaction(transaction: any): Promise<TransactionResult>;
}

export interface QRGenerationRequest {
  orderId: string;
  amount: number;
  content: string;
  bankAccount?: string;
  expireMinutes?: number;
}

export interface QRCodeResponse {
  qrUrl: string;
  qrString: string;
  amount: number;
  content: string;
  bankAccount?: string;
  expireTime?: Date;
  metadata?: Record<string, any>;
}

export interface TransactionResult {
  transactionId: string;
  orderId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  message?: string;
  metadata?: Record<string, any>;
}

export interface WebhookPayload {
  id: string;
  gateway: string;
  transaction_date: string;
  account_number: string;
  amount_in: number;
  amount_out: number;
  accumulated: number;
  code: string;
  content: string;
  bank_brand_name: string;
  sub_account?: string;
}
