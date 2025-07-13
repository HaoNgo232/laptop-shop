import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  QRGenerationRequest,
  QRCodeResponse,
  TransactionResult,
} from '@/payments/interfaces/payment-provider.interfaces';
import * as crypto from 'crypto';
import axios from 'axios';
import { SepayWebhookDto } from '@/payments/dtos/sepay-webhook.dto';
import { PaymentProvider } from './payment-provider.factory';
import { AxiosError } from 'axios';

@Injectable()
export class SepayProvider implements PaymentProvider {
  readonly name = 'SEPAY_QR';
  private readonly logger = new Logger(SepayProvider.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Tạo QR code cho thanh toán SePay
   */
  generateQRCode(orderInfo: QRGenerationRequest): Promise<QRCodeResponse> {
    try {
      // Lấy thông tin bank từ config hoặc từ request
      const bankAccount = orderInfo.bankAccount ?? this.configService.get('SEPAY_BANK_ACCOUNT');
      const bankCode = this.configService.get<string>('SEPAY_BANK_CODE');
      const accountName = this.configService.get<string>('SEPAY_ACCOUNT_NAME');

      // Format content với order ID để dễ tracking theo format của Sepay: DH{orderId}
      // Pattern này sẽ được dùng để extract orderId trong webhook
      const content = `DH${orderInfo.orderId}`;

      // Validation required fields
      if (!bankAccount) {
        throw new Error('Bank account là bắt buộc nhưng chưa được cấu hình');
      }

      if (!bankCode) {
        throw new Error('Bank code là bắt buộc nhưng chưa được cấu hình');
      }

      // Tạo QR URL theo format SePay
      const qrUrl = this.generateSepayQRUrl({
        bankAccount,
        bankCode,
        amount: orderInfo.amount,
        content,
        accountName,
      });

      // Set expire time - default 15 phút
      const expireTime = new Date();
      expireTime.setMinutes(expireTime.getMinutes() + (orderInfo.expireMinutes || 15));

      return Promise.resolve({
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
      });
    } catch (error) {
      this.logger.error(`Error generating QR code for order ${orderInfo.orderId}:`, error);
      return Promise.reject(new Error(`Failed to generate SePay QR code: ${error}`));
    }
  }

  /**
   * Xác minh webhook từ SePay
   */
  verifyWebhook(payload: SepayWebhookDto, signature?: string): boolean {
    try {
      if (signature) {
        const secret = this.configService.get<string>('SEPAY_WEBHOOK_SECRET');
        if (!secret) {
          this.logger.warn('SEPAY_WEBHOOK_SECRET chưa được cấu hình, bỏ qua xác minh chữ ký');
          return true; // Bỏ qua nếu không có secret
        }

        // Tạo expected signature bằng HMAC SHA256
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(payload))
          .digest('hex');

        // So sánh signature
        if (signature !== expectedSignature) {
          this.logger.error('Invalid webhook signature');
          return false;
        }
        this.logger.log('Webhook signature verified successfully.');
      }

      return true;
    } catch (error) {
      this.logger.error('Error verifying webhook:', error);
      return false;
    }
  }

  /**
   * Xử lý transaction từ SePay webhook
   */
  async processTransaction(transaction: SepayWebhookDto): Promise<TransactionResult> {
    try {
      this.logger.log(`Processing transaction:`, {
        id: transaction.id,
        code: transaction.code,
        content: transaction.content,
        transferType: transaction.transferType,
        transferAmount: transaction.transferAmount,
      });

      let orderId: string;

      // Strategy 1: Thử tìm từ content trước
      const orderMatch = transaction.content.match(/DH([a-f0-9-]{32,36})/i);
      if (orderMatch && orderMatch[1]) {
        let extractedId = orderMatch[1];

        // Handle UUID không có dấu gạch
        if (extractedId.length === 32 && !extractedId.includes('-')) {
          extractedId = [
            extractedId.slice(0, 8),
            extractedId.slice(8, 12),
            extractedId.slice(12, 16),
            extractedId.slice(16, 20),
            extractedId.slice(20, 32),
          ].join('-');
        }

        orderId = extractedId;
        this.logger.log(`Extracted orderId from 'content': ${orderId}`);
      } else if (transaction.code && transaction.code.startsWith('DH')) {
        // Fallback: nếu content không có thì mới dùng code
        orderId = transaction.code.replace(/^DH/, '');
        this.logger.log(`Extracted orderId from 'code': ${orderId}`);
      } else {
        throw new Error('Cannot extract orderId from transaction');
      }

      // Validation: Ensure orderId is valid UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(orderId)) {
        this.logger.error(`Invalid UUID format: ${orderId}`);
        throw new Error(`OrderId is not a valid UUID: ${orderId}`);
      }

      const amount = transaction.transferAmount;

      // Determine transaction status based on SePay webhook data
      let status: 'success' | 'failed' | 'pending' = 'pending';
      let message = 'Transaction is being processed.';

      // Success condition: transferType = 'in' (incoming) và amount > 0
      if (transaction.transferType === 'in' && amount > 0) {
        status = 'success';
        message = 'Payment completed successfully.';
      } else {
        // Failed: không phải incoming payment hoặc amount <= 0
        status = 'failed';
        message = 'Transaction was not an incoming payment.';
      }

      this.logger.log(`Transaction processed successfully: orderId=${orderId}, status=${status}`);

      return Promise.resolve({
        transactionId: transaction.id,
        orderId,
        amount,
        status,
        message,
        metadata: {
          bankCode: transaction.gateway,
          transactionCode: transaction.referenceCode,
          transactionDate: transaction.transactionDate,
          accountNumber: transaction.accountNumber,
          provider: this.name,
        },
      });
    } catch (error) {
      this.logger.error('Error processing transaction:', error);
      return Promise.reject(new Error(`Failed to process SePay transaction: ${error}`));
    }
  }

  /**
   * Generate SePay QR URL theo format chuẩn
   *
   * Format: https://qr.sepay.vn/img?acc={account}&bank={code}&amount={amount}&des={content}
   * Template compact để QR nhỏ gọn hơn
   */
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
      template: 'compact', // QR template compact
    });

    // Optional: thêm account name nếu có
    if (accountName) {
      queryParams.append('name', accountName);
    }

    return `${baseUrl}?${queryParams.toString()}`;
  }

  /**
   * Lấy lịch sử giao dịch từ SePay API
   *
   * Note: SePay có rate limit 2 calls/second
   */
  async getTransactionHistory(limit: number = 20): Promise<TransactionResult[]> {
    try {
      const apiKey = this.configService.get<string>('SEPAY_API_KEY');
      const baseUrl = this.configService.get<string>(
        'SEPAY_API_BASE_URL',
        'https://my.sepay.vn/userapi',
      );

      if (!apiKey) {
        throw new Error('SEPAY_API_KEY not configured');
      }

      // Apply rate limit để tránh bị SePay reject
      await this.rateLimit();

      const response: { data: { data: TransactionResult[] } } = await axios.get(
        `${baseUrl}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          params: {
            limit,
            offset: 0,
          },
          timeout: 10000, // 10s timeout
        },
      );

      this.logger.log(`Fetched ${response.data?.data?.length || 0} transactions from SePay`);

      return response.data?.data || [];
    } catch (error) {
      this.logger.error('Error fetching transaction history:', error);

      // Log chi tiết lỗi cho SePay API responses
      if (error instanceof AxiosError) {
        this.logger.error(`SePay API Error: ${error.response?.status} - ${error.response?.data}`);
      }

      throw new Error(
        `Failed to fetch SePay transaction history: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Lấy danh sách bank accounts từ SePay
   *
   * Dùng để validate bank account có tồn tại và active không
   */
  async getBankAccounts(): Promise<TransactionResult[]> {
    try {
      const apiKey = this.configService.get<string>('SEPAY_API_KEY');
      const baseUrl = this.configService.get<string>(
        'SEPAY_API_BASE_URL',
        'https://my.sepay.vn/userapi',
      );

      if (!apiKey) {
        throw new Error('SEPAY_API_KEY not configured');
      }

      // Apply rate limit
      await this.rateLimit();

      const response: { data: { data: TransactionResult[] } } = await axios.get(
        `${baseUrl}/bank-accounts`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      return response.data?.data || [];
    } catch (error) {
      this.logger.error('Error fetching bank accounts:', error);
      throw new Error(
        `Failed to fetch SePay bank accounts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Rate limiting để tuân thủ SePay API limits
   *
   * SePay cho phép maximum 2 calls/second
   */
  private async rateLimit(): Promise<void> {
    // SePay rate limit: 2 calls/second
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}
