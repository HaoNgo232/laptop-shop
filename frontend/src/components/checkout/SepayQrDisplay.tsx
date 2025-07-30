import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Copy, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { PaymentStatusEnum } from '@/types';
import type { QRCodeResponse } from "@/types";

interface SepayQrDisplayProps {
    readonly qrCodeData: QRCodeResponse;
    readonly paymentStatus: PaymentStatusEnum;
    readonly onRetry?: () => void;
}

export function SepayQrDisplay({ qrCodeData, paymentStatus, onRetry }: SepayQrDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(qrCodeData.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const getStatusConfig = (): {
        icon: React.ElementType;
        color: string;
        bgColor: string;
        badge: 'default' | 'destructive' | 'outline' | 'secondary';
        title: string;
        message: string;
    } => {
        switch (paymentStatus) {
            case PaymentStatusEnum.WAITING:
                return {
                    icon: Clock,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    badge: 'default' as const,
                    title: 'Chờ thanh toán',
                    message: 'Vui lòng quét mã QR để thanh toán'
                };
            case PaymentStatusEnum.PAID:
                return {
                    icon: CheckCircle,
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    badge: 'default' as const,
                    title: 'Thanh toán thành công',
                    message: 'Đơn hàng của bạn đã được xác nhận'
                };
            case PaymentStatusEnum.FAILED:
                return {
                    icon: XCircle,
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    badge: 'destructive' as const,
                    title: 'Thanh toán thất bại',
                    message: 'Vui lòng thử lại hoặc chọn phương thức khác'
                };
            default:
                return {
                    icon: Clock,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    badge: 'default' as const,
                    title: 'Chờ thanh toán',
                    message: 'Vui lòng quét mã QR để thanh toán'
                };
        }
    };

    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Thanh toán QR Code</span>
                    <Badge variant={statusConfig.badge}>
                        {statusConfig.title}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Status */}
                <div className={`p-4 rounded-lg ${statusConfig.bgColor}`}>
                    <div className="flex items-center space-x-3">
                        <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                        <div>
                            <p className={`font-medium ${statusConfig.color}`}>
                                {statusConfig.title}
                            </p>
                            <p className="text-sm text-gray-600">
                                {statusConfig.message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* QR Code */}
                {paymentStatus === 'WAITING' && (
                    <div className="text-center space-y-4">
                        <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                            <img
                                src={qrCodeData.qrUrl}
                                alt="QR Code thanh toán"
                                className="w-48 h-48 mx-auto"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-qr.png';
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-600">
                            Mở ứng dụng ngân hàng và quét mã QR để thanh toán
                        </p>
                    </div>
                )}

                {/* Payment Info */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Số tiền:</span>
                        <span className="font-bold text-lg text-primary">
                            {formatCurrency(qrCodeData.amount)}
                        </span>
                    </div>

                    <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Nội dung:</span>
                        <div className="text-right flex-1 ml-2">
                            <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                                {qrCodeData.content}
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyContent}
                                className="mt-1 h-6 text-xs"
                            >
                                <Copy className="h-3 w-3 mr-1" />
                                {copied ? 'Đã sao chép' : 'Sao chép'}
                            </Button>
                        </div>
                    </div>

                    {qrCodeData.bankAccount && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tài khoản:</span>
                            <span className="text-sm font-medium">{qrCodeData.bankAccount}</span>
                        </div>
                    )}

                    {qrCodeData.expireTime && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Hết hạn:</span>
                            <span className="text-sm text-red-600">
                                {new Date(qrCodeData.expireTime).toLocaleTimeString('vi-VN')}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {paymentStatus === 'FAILED' && onRetry && (
                    <Button
                        onClick={onRetry}
                        className="w-full"
                        variant="outline"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Thử lại
                    </Button>
                )}

                {paymentStatus === 'WAITING' && (
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full"></div>
                            <span>Đang chờ thanh toán...</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 