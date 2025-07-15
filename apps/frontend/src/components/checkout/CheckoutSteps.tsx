import type { CheckoutStep } from '@/hooks/useCheckoutFlow';

interface CheckoutStepsProps {
    currentStep: CheckoutStep;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
    const steps = [
        { key: 'shipping', label: 'Địa chỉ' },
        { key: 'payment', label: 'Thanh toán' },
        { key: 'review', label: 'Xác nhận' },
        { key: 'complete', label: 'Hoàn thành' }
    ];

    const stepOrder = ['shipping', 'payment', 'review', 'processing', 'payment-waiting'];
    const currentStepIndex = stepOrder.indexOf(currentStep);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
                {steps.map((step, index) => (
                    <div key={step.key} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= currentStepIndex
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                            {index + 1}
                        </div>
                        <span className={`ml-2 text-sm ${index <= currentStepIndex
                                ? 'text-primary font-medium'
                                : 'text-gray-500'
                            }`}>
                            {step.label}
                        </span>
                        {index < 3 && <div className="w-8 h-px bg-gray-300 mx-4" />}
                    </div>
                ))}
            </div>
        </div>
    );
} 