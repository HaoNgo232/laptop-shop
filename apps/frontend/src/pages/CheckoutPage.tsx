import { AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShippingAddressForm } from '@/components/checkout/ShippingAddressForm';
import { PaymentMethodSelection } from '@/components/checkout/PaymentMethodSelection';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { SepayQrDisplay } from '@/components/checkout/SepayQrDisplay';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { OrderReview } from '@/components/checkout/OrderReview';
import { ProcessingSuccess } from '@/components/checkout/ProcessingSuccess';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';

export function CheckoutPage() {
    const {
        // Data
        currentStep,
        shippingAddress,
        paymentMethod,
        createdOrder,
        qrCodeData,

        // States
        isLoading,
        error,
        paymentStatus,
        shouldShowPage,

        // Actions
        handleShippingSubmit,
        handlePaymentSelect,
        handlePlaceOrder,
        handleBack,
        handleRetry,
        clearError,
    } = useCheckoutFlow();

    // Early return nếu không đủ điều kiện
    if (!shouldShowPage) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Header */}
                    <CheckoutHeader onBack={handleBack} />

                    {/* Progress Steps */}
                    <CheckoutSteps currentStep={currentStep} />

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
                                <OrderReview
                                    shippingAddress={shippingAddress}
                                    paymentMethod={paymentMethod}
                                    isLoading={isLoading}
                                    onPlaceOrder={handlePlaceOrder}
                                />
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
                                <ProcessingSuccess />
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