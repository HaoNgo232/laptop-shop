import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutHeaderProps {
    readonly onBack: () => void;
}

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
    return (
        <div className="flex items-center space-x-4 mb-6">
            <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
        </div>
    );
} 