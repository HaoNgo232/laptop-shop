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

  generateQRCode(orderInfo: QRGenerationRequest): Promise<QRCodeResponse> {
    try {
      const bankAccount = orderInfo.bankAccount ?? this.configService.get('SEPAY_BANK_ACCOUNT');
      const bankCode = this.configService.get<string>('SEPAY_BANK_CODE');
      const accountName = this.configService.get<string>('SEPAY_ACCOUNT_NAME');

      // Format content với order ID để dễ tracking theo format của Sepay: DH{orderId}
      const content = `DH${orderInfo.orderId}`;

      if (!bankAccount) {
        throw new Error('Bank account là bắt buộc nhưng chưa được cấu hình');
      }

      if (!bankCode) {
        throw new Error('Bank code là bắt buộc nhưng chưa được cấu hình');
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

  verifyWebhook(payload: SepayWebhookDto, signature?: string): boolean {
    try {
      // Sepay không đề cập đến signature HMAC trong docs, nhưng nếu có thì vẫn check
      if (signature) {
        const secret = this.configService.get<string>('SEPAY_WEBHOOK_SECRET');
        if (!secret) {
          this.logger.warn('SEPAY_WEBHOOK_SECRET chưa được cấu hình, bỏ qua xác minh chữ ký');
          return true; // Bỏ qua nếu không có secret
        }

        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(payload))
          .digest('hex');

        if (signature !== expectedSignature) {
          this.logger.error('Invalid webhook signature');
          return false;
        }
        this.logger.log('Webhook signature verified successfully.');
      }

      // Validation cơ bản đã được thực hiện bởi DTO (class-validator)
      // Chỉ cần kiểm tra logic nghiệp vụ ở đây nếu cần.
      // Ví dụ: kiểm tra xem gateway có phải từ một nguồn đáng tin cậy hay không.
      // Hiện tại, DTO đã đủ.

      return true;
    } catch (error) {
      this.logger.error('Error verifying webhook:', error);
      return false;
    }
  }

  async processTransaction(transaction: SepayWebhookDto): Promise<TransactionResult> {
    try {
      this.logger.log(`Processing transaction:`, {
        id: transaction.id,
        code: transaction.code,
        content: transaction.content,
        transferType: transaction.transferType,
        transferAmount: transaction.transferAmount,
      });

      // Ưu tiên sử dụng trường `code` mà SePay đã bóc tách sẵn.
      // Nếu không có, thử bóc tách từ `content`.
      let orderId: string;

      if (transaction.code) {
        // SePay có thể chỉ trả về partial code, cần check format
        if (transaction.code.startsWith('DH')) {
          orderId = transaction.code.replace(/^DH/, '');
        } else {
          orderId = transaction.code;
        }
        this.logger.log(`Extracted orderId from 'code': ${orderId}`);
      } else {
        // Fallback: extract từ content với regex cho UUID (có thể có prefix như IBFT)
        // Format: "IBFT DHdf2019b9d47c40de95f1fa8cfe16f138" hoặc "DHdf2019b9-d47c-40de-95f1-fa8cfe16f138"
        const orderMatch = transaction.content.match(/DH([a-f0-9-]{32,36})/i);
        if (!orderMatch || !orderMatch[1]) {
          throw new Error(
            `Invalid transaction content format - DH{UUID} not found in: ${transaction.content}`,
          );
        }

        let extractedId = orderMatch[1];

        // Nếu UUID không có dấu - thì thêm vào
        if (extractedId.length === 32 && !extractedId.includes('-')) {
          // Convert từ "df2019b9d47c40de95f1fa8cfe16f138" thành "df2019b9-d47c-40de-95f1-fa8cfe16f138"
          extractedId = [
            extractedId.slice(0, 8),
            extractedId.slice(8, 12),
            extractedId.slice(12, 16),
            extractedId.slice(16, 20),
            extractedId.slice(20, 32),
          ].join('-');
          this.logger.log(`Formatted UUID: ${extractedId}`);
        }

        orderId = extractedId;
        this.logger.log(`Extracted orderId from 'content': ${orderId}`);
      }

      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(orderId)) {
        this.logger.error(`Invalid UUID format: ${orderId}`);
        throw new Error(`OrderId is not a valid UUID: ${orderId}`);
      }

      const amount = transaction.transferAmount;

      // Determine transaction status
      let status: 'success' | 'failed' | 'pending' = 'pending';
      let message = 'Transaction is being processed.';

      if (transaction.transferType === 'in' && amount > 0) {
        status = 'success';
        message = 'Payment completed successfully.';
      } else {
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

      // Note: Rate limit 2 calls/second
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
          timeout: 10000, // 10 seconds timeout
        },
      );

      this.logger.log(`Fetched ${response.data?.data?.length || 0} transactions from SePay`);
      return response.data?.data || [];
    } catch (error) {
      this.logger.error('Error fetching transaction history:', error);

      if (error instanceof AxiosError) {
        this.logger.error(`SePay API Error: ${error.response?.status} - ${error.response?.data}`);
      }

      throw new Error(
        `Failed to fetch SePay transaction history: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

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

  private async rateLimit(): Promise<void> {
    // SePay rate limit: 2 calls/second
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}
