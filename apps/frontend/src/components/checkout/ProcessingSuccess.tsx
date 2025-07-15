import { CheckCircle } from 'lucide-react';

export function ProcessingSuccess() {
    return (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                Đặt hàng thành công!
            </h3>
            <p className="text-gray-600">
                Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất.
            </p>
        </div>
    );
} 