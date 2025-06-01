import { registerAs } from '@nestjs/config';

export default registerAs('sepay', () => ({
  apiKey: process.env.SEPAY_API_KEY,
  bankAccount: process.env.SEPAY_BANK_ACCOUNT,
  bankCode: process.env.SEPAY_BANK_CODE || 'VCB',
  accountName: process.env.SEPAY_ACCOUNT_NAME,
  webhookSecret: process.env.SEPAY_WEBHOOK_SECRET,
  apiBaseUrl: process.env.SEPAY_API_BASE_URL || 'https://my.sepay.vn/userapi',
  qrExpireMinutes: parseInt(process.env.SEPAY_QR_EXPIRE_MINUTES || '15'),
}));
