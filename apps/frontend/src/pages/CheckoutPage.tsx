import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShippingAddressForm } from '@/components/checkout/ShippingAddressForm';
import { PaymentMethodSelection } from '@/components/checkout/PaymentMethodSelection';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { SepayQrDisplay } from '@/components/checkout/SepayQrDisplay';
import type { ShippingAddress } from '@/types/order';
import { PaymentMethodEnum, PaymentStatusEnum } from '@web-ecom/shared-types/orders/enums';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useCheckoutStore } from '@/stores/checkoutStore';


type CheckoutStep = 'shipping' | 'payment' | 'review' | 'processing' | 'payment-waiting';

export function CheckoutPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { cart } = useCartStore();
    const {
        shippingAddress,
        paymentMethod,
        isLoading,
        error,
        createdOrder,
        qrCodeData,
        paymentStatus,
        setShippingAddress,
        setPaymentMethod,
        createOrder,
        resetCheckout,
        clearError
    } = useCheckoutStore();

    const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {
                state: {
                    from: '/checkout',
                    message: 'Vui lòng đăng nhập để thanh toán'
                }
            });
        }
    }, [isAuthenticated, navigate]);

    // Redirect nếu giỏ hàng trống
    useEffect(() => {
        if (!cart || cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    // Handle payment status changes
    useEffect(() => {
        if (paymentStatus === PaymentStatusEnum.PAID && createdOrder) {
            // Delay để user thấy success state
            setTimeout(() => {
                navigate(`/orders/${createdOrder.id}`, { replace: true });
            }, 2000);
        }
    }, [paymentStatus, createdOrder, navigate]);

    // Step navigation logic
    useEffect(() => {
        if (createdOrder && qrCodeData && paymentMethod === 'SEPAY_QR') {
            setCurrentStep('payment-waiting');
        } else if (createdOrder && paymentMethod === 'COD') {
            setCurrentStep('processing');
        }
    }, [createdOrder, qrCodeData, paymentMethod]);

    const handleShippingSubmit = (address: ShippingAddress) => {
        setShippingAddress(address);
        setCurrentStep('payment');
    };

    const handlePaymentSelect = (method: PaymentMethodEnum) => {
        setPaymentMethod(method);
        setCurrentStep('review');
    };

    const handlePlaceOrder = async () => {
        await createOrder();
    };

    const handleBack = () => {
        if (currentStep === 'payment') {
            setCurrentStep('shipping');
        } else if (currentStep === 'review') {
            setCurrentStep('payment');
        } else {
            navigate('/cart');
        }
    };

    const handleRetry = () => {
        resetCheckout();
        setCurrentStep('shipping');
    };

    if (!isAuthenticated || !cart || cart.items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBack}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Quay lại</span>
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            {[
                                { key: 'shipping', label: 'Địa chỉ' },
                                { key: 'payment', label: 'Thanh toán' },
                                { key: 'review', label: 'Xác nhận' },
                                { key: 'complete', label: 'Hoàn thành' }
                            ].map((step, index) => (
                                <div key={step.key} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= ['shipping', 'payment', 'review', 'processing', 'payment-waiting'].indexOf(currentStep)
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <span className={`ml-2 text-sm ${index <= ['shipping', 'payment', 'review', 'processing', 'payment-waiting'].indexOf(currentStep)
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

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="flex justify-between items-center">
                                <span>{error}</span>
                                <Button variant="outline" size="sm" onClick={clearError}>
                                    Đóng
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Step 1: Shipping Address */}
                            {currentStep === 'shipping' && (
                                <ShippingAddressForm
                                    onSubmit={handleShippingSubmit}
                                    initialData={shippingAddress || undefined}
                                    isLoading={isLoading}
                                />
                            )}

                            {/* Step 2: Payment Method */}
                            {currentStep === 'payment' && (
                                <PaymentMethodSelection
                                    onSelect={handlePaymentSelect}
                                    selected={paymentMethod || undefined}
                                    isLoading={isLoading}
                                />
                            )}

                            {/* Step 3: Review Order */}
                            {currentStep === 'review' && (
                                <div className="space-y-6">
                                    {/* Review Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border rounded-lg">
                                            <h3 className="font-medium mb-2">Địa chỉ giao hàng</h3>
                                            <p className="text-sm text-gray-600">{shippingAddress?.fullAddress}</p>
                                            {shippingAddress?.note && (
                                                <p className="text-sm text-gray-500 mt-1">Ghi chú: {shippingAddress.note}</p>
                                            )}
                                        </div>
                                        <div className="p-4 border rounded-lg">
                                            <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
                                            <p className="text-sm text-gray-600">
                                                {paymentMethod === 'SEPAY_QR' && 'Thanh toán QR Code'}
                                                {paymentMethod === 'COD' && 'Thanh toán khi nhận hàng'}
                                                {paymentMethod === 'BANK_TRANSFER' && 'Chuyển khoản ngân hàng'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Place Order Button */}
                                    <Button
                                        onClick={handlePlaceOrder}
                                        className="w-full"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
                                    </Button>
                                </div>
                            )}

                            {/* Step 4: Payment Waiting (SEPAY_QR) */}
                            {currentStep === 'payment-waiting' && qrCodeData && (
                                <SepayQrDisplay
                                    qrCodeData={qrCodeData}
                                    paymentStatus={paymentStatus}
                                    onRetry={handleRetry}
                                />
                            )}

                            {/* Step 4: Processing (COD) */}
                            {currentStep === 'processing' && paymentMethod === 'COD' && (
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
                            )}
                        </div>

                        {/* Sidebar: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <OrderSummary />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 