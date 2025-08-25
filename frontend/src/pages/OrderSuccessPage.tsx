import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { OrderSuccess } from '@/components/OrderSuccess';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { useAuthStore } from '@/stores/authStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { createdOrder, startNewOrder } = useCheckoutStore();

  // Get order ID from URL params if available
  const orderIdFromUrl = searchParams.get('orderId');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/checkout/success',
          message: 'Vui lòng đăng nhập để xem thông tin đơn hàng',
        },
      });
      return;
    }

    // If no order in store and no orderId in URL, redirect to cart
    if (!createdOrder && !orderIdFromUrl) {
      navigate('/cart');
    }
  }, [isAuthenticated, createdOrder, orderIdFromUrl, navigate]);

  const handleCreateNewOrder = () => {
    startNewOrder();
    navigate('/products');
  };

  const handleViewOrderDetail = () => {
    const orderId = createdOrder?.id || orderIdFromUrl;
    if (orderId) {
      navigate(`/orders/${orderId}`);
    }
  };

  // Loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Đang kiểm tra thông tin...</span>
          </div>
        </div>
      </div>
    );
  }

  // No order available
  if (!createdOrder && !orderIdFromUrl) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {createdOrder ? (
          <OrderSuccess
            order={createdOrder}
            onCreateNewOrder={handleCreateNewOrder}
            onViewOrderDetail={handleViewOrderDetail}
          />
        ) : (
          <div className="max-w-2xl mx-auto py-8 px-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Đang tải thông tin đơn hàng...
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}