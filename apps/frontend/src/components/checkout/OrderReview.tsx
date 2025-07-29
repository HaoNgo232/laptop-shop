import { Button } from '@/components/ui/button';
import type { ShippingAddress } from '@/types/order';
import { PaymentMethodEnum } from '@web-ecom/shared-types/orders/enums';

interface OrderReviewProps {
    readonly shippingAddress: ShippingAddress | null;
    readonly paymentMethod: PaymentMethodEnum | null;
    readonly isLoading: boolean;
    readonly onPlaceOrder: () => void;
}

export function OrderReview({
    shippingAddress,
    paymentMethod,
    isLoading,
    onPlaceOrder
}: OrderReviewProps) {
    const getPaymentMethodLabel = (method: PaymentMethodEnum | null) => {
        switch (method) {
            case 'SEPAY_QR':
                return 'Thanh toán QR Code';
            case 'COD':
                return 'Thanh toán khi nhận hàng';
            case 'BANK_TRANSFER':
                return 'Chuyển khoản ngân hàng';
            default:
                return 'Chưa chọn';
        }
    };

    return (
        <div className="space-y-6">
            {/* Review Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Địa chỉ giao hàng</h3>
                    <p className="text-sm text-gray-600">{shippingAddress?.fullAddress}</p>
                    <p className="text-sm text-gray-600">Số điện thoại: {shippingAddress?.phoneNumber}</p>
                    {shippingAddress?.note && (
                        <p className="text-sm text-gray-500 mt-1">Ghi chú: {shippingAddress.note}</p>
                    )}
                </div>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
                    <p className="text-sm text-gray-600">
                        {getPaymentMethodLabel(paymentMethod)}
                    </p>
                </div>
            </div>

            {/* Place Order Button */}
            <Button
                onClick={onPlaceOrder}
                className="w-full"
                size="lg"
                disabled={isLoading}
            >
                {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
            </Button>
        </div>
    );
} 