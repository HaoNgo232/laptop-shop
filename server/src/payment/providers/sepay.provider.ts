import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentProvider,
  QRGenerationRequest,
  QRCodeResponse,
  TransactionResult,
  WebhookPayload,
} from '@/payment/interfaces/payment-provider.interfaces';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class SepayProvider implements PaymentProvider {
  readonly name = 'SEPAY_QR';
  private readonly logger = new Logger(SepayProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async generateQRCode(orderInfo: QRGenerationRequest): Promise<QRCodeResponse> {
    try {
      const bankAccount = orderInfo.bankAccount ?? this.configService.get('SEPAY_BANK_ACCOUNT');
      const bankCode = this.configService.get('SEPAY_BANK_CODE');
      const accountName = this.configService.get('SEPAY_ACCOUNT_NAME');

      // Format content với order ID để dễ tracking
      const content = `ORDER${orderInfo.orderId} ${orderInfo.content}`.substring(0, 100);

      if (!bankAccount) {
        throw new Error('Bank account là bắt buộc nhưng chưa được cấu hình');
      }

      // Tạo QR URL theo format SePay
      const qrUrl = this.generateSepayQRUrl({
        bankAccount,
        bankCode,
        amount: orderInfo.amount,
        content,
        accountName,
      });

      const expireTime = new Date();
      expireTime.setMinutes(expireTime.getMinutes() + (orderInfo.expireMinutes || 15));

      return {
        qrUrl,
        qrString: content,
        amount: orderInfo.amount,
        content,
        bankAccount,
        expireTime,
        metadata: {
          bankCode,
          accountName,
          provider: this.name,
        },
      };
    } catch (error) {
      this.logger.error(`Error generating QR code for order ${orderInfo.orderId}:`, error);
      throw new Error(`Failed to generate SePay QR code: ${error.message}`);
    }
  }

  verifyWebhook(payload: WebhookPayload, signature?: string): boolean {
    try {
      // Verify webhook signature if provided
      if (signature) {
        const secret = this.configService.get('SEPAY_WEBHOOK_SECRET');
        if (!secret) {
          this.logger.warn('SEPAY_WEBHOOK_SECRET chưa được cấu hình, bỏ qua xác minh chữ ký');
          return true;
        }

        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(payload))
          .digest('hex');

        if (signature !== expectedSignature) {
          this.logger.error('Invalid webhook signature');
          return false;
        }
      }

      // Verify basic payload structure
      const requiredFields = ['id', 'gateway', 'amount_in', 'content'];
      for (const field of requiredFields) {
        if (!payload[field]) {
          this.logger.error(`Missing required field: ${field}`);
          return false;
        }
      }

      // Verify gateway type
      if (payload.gateway !== 'SEPAY') {
        this.logger.error(`Invalid gateway: ${payload.gateway}`);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('Error verifying webhook:', error);
      return false;
    }
  }

  async processTransaction(transaction: WebhookPayload): Promise<TransactionResult> {
    try {
      // Extract order ID from content
      const orderMatch = transaction.content.match(/ORDER(\w+)/);
      if (!orderMatch) {
        throw new Error('Invalid transaction content format - ORDER ID not found');
      }

      const orderId = orderMatch[1];
      const amount = transaction.amount_in;

      // Determine transaction status
      let status: 'success' | 'failed' | 'pending' = 'pending';
      let message = 'Transaction processing';

      if (amount > 0) {
        status = 'success';
        message = 'Payment completed successfully';
      } else if (transaction.amount_out > 0) {
        status = 'failed';
        message = 'Outgoing transaction detected';
      }

      return {
        transactionId: transaction.id,
        orderId,
        amount,
        status,
        message,
        metadata: {
          bankCode: transaction.bank_brand_name,
          transactionCode: transaction.code,
          transactionDate: transaction.transaction_date,
          accountNumber: transaction.account_number,
          provider: this.name,
        },
      };
    } catch (error) {
      this.logger.error('Error processing transaction:', error);
      throw new Error(`Failed to process SePay transaction: ${error.message}`);
    }
  }

  private generateSepayQRUrl(params: {
    bankAccount: string;
    bankCode: string;
    amount: number;
    content: string;
    accountName?: string;
  }): string {
    const { bankAccount, bankCode, amount, content, accountName } = params;

    // SePay QR URL format
    const baseUrl = 'https://qr.sepay.vn/img';
    const queryParams = new URLSearchParams({
      acc: bankAccount,
      bank: bankCode,
      amount: amount.toString(),
      des: content,
      template: 'compact',
    });

    if (accountName) {
      queryParams.append('name', accountName);
    }

    return `${baseUrl}?${queryParams.toString()}`;
  }

  // Utility method for API calls to SePay
  async getTransactionHistory(limit: number = 20): Promise<any[]> {
    try {
      const apiKey = this.configService.get('SEPAY_API_KEY');
      const baseUrl = this.configService.get('SEPAY_API_BASE_URL', 'https://my.sepay.vn/userapi');

      if (!apiKey) {
        throw new Error('SEPAY_API_KEY not configured');
      }

      // Note: Rate limit 2 calls/second
      await this.rateLimit();

      const response = await axios.get(`${baseUrl}/transactions`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          limit,
          offset: 0,
        },
        timeout: 10000, // 10 seconds timeout
      });

      this.logger.log(`Fetched ${response.data?.data?.length || 0} transactions from SePay`);
      return response.data?.data || [];
    } catch (error) {
      this.logger.error('Error fetching transaction history:', error);

      if (error.response) {
        this.logger.error(`SePay API Error: ${error.response.status} - ${error.response.data}`);
      }

      throw new Error(`Failed to fetch SePay transaction history: ${error.message}`);
    }
  }

  async getBankAccounts(): Promise<any[]> {
    try {
      const apiKey = this.configService.get('SEPAY_API_KEY');
      const baseUrl = this.configService.get('SEPAY_API_BASE_URL', 'https://my.sepay.vn/userapi');

      if (!apiKey) {
        throw new Error('SEPAY_API_KEY not configured');
      }

      await this.rateLimit();

      const response = await axios.get(`${baseUrl}/bank-accounts`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      return response.data?.data || [];
    } catch (error) {
      this.logger.error('Error fetching bank accounts:', error);
      throw new Error(`Failed to fetch SePay bank accounts: ${error.message}`);
    }
  }

  private async rateLimit(): Promise<void> {
    // SePay rate limit: 2 calls/second
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}
