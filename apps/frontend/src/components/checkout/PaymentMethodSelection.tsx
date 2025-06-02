import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, Truck } from 'lucide-react';
import { PaymentMethodEnum } from '@/enums/order';

interface PaymentMethodOption {
    method: PaymentMethodEnum;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    available: boolean;
}

interface PaymentMethodSelectionProps {
    onSelect: (method: PaymentMethodEnum) => void;
    selected?: PaymentMethodEnum;
    isLoading?: boolean;
}

export function PaymentMethodSelection({ onSelect, selected, isLoading = false }: PaymentMethodSelectionProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodEnum | null>(selected || null);

    const paymentMethods: PaymentMethodOption[] = [
        {
            method: PaymentMethodEnum.SEPAY_QR,
            label: 'Thanh toán QR Code',
            description: 'Quét mã QR để thanh toán qua ngân hàng',
            icon: Smartphone,
            available: true
        },
        {
            method: PaymentMethodEnum.COD,
            label: 'Thanh toán khi nhận hàng',
            description: 'Thanh toán bằng tiền mặt khi nhận hàng',
            icon: Truck,
            available: true
        },
        {
            method: PaymentMethodEnum.BANK_TRANSFER,
            label: 'Chuyển khoản ngân hàng',
            description: 'Chuyển khoản trực tiếp qua ngân hàng',
            icon: CreditCard,
            available: false // Chưa implement
        }
    ];

    const handleSelectMethod = (method: PaymentMethodEnum) => {
        setSelectedMethod(method);
    };

    const handleConfirm = () => {
        if (selectedMethod) {
            onSelect(selectedMethod);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Phương thức thanh toán</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Payment Options */}
                <div className="space-y-3">
                    {paymentMethods.map((option) => {
                        const Icon = option.icon;
                        return (
                            <div
                                key={option.method}
                                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${selectedMethod === option.method
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                    } ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => option.available && handleSelectMethod(option.method)}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className="h-6 w-6 text-gray-600" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">
                                            {option.label}
                                            {!option.available && (
                                                <span className="ml-2 text-xs text-gray-500">(Sắp có)</span>
                                            )}
                                        </h4>
                                        <p className="text-sm text-gray-600">{option.description}</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 ${selectedMethod === option.method
                                        ? 'border-primary bg-primary'
                                        : 'border-gray-300'
                                        }`}>
                                        {selectedMethod === option.method && (
                                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Confirm Button */}
                <Button
                    onClick={handleConfirm}
                    className="w-full"
                    disabled={!selectedMethod || isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : 'Xác nhận phương thức thanh toán'}
                </Button>
            </CardContent>
        </Card>
    );
} 