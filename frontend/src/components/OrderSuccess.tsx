import { CheckCircle, Package, CreditCard, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { OrderDetail } from '@/types';

interface OrderSuccessProps {
  order: OrderDetail;
  onCreateNewOrder: () => void;
  onViewOrderDetail: () => void;
}

export function OrderSuccess({ order, onCreateNewOrder, onViewOrderDetail }: OrderSuccessProps) {
  const getPaymentStatusColor = () => {
    switch (order.paymentStatus) {
      case 'PAID':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'WAITING':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = () => {
    switch (order.paymentStatus) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'WAITING':
        return 'Đang chờ thanh toán';
      default:
        return 'Chưa xác định';
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600">
          Cảm ơn bạn đã tin tưởng và đặt hàng tại cửa hàng. Đơn hàng của bạn đã được tiếp nhận.
        </p>
      </div>

      {/* Order Information Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          <div className="space-y-4">
            {/* Order ID */}
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="font-mono text-sm font-medium">{order.id}</p>
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="text-sm font-medium">
                  {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản QR'}
                </p>
              </div>
            </div>

            <Separator />

            {/* Shipping Address */}
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                <p className="text-sm font-medium">{order.shippingAddress}</p>
              </div>
            </div>

            <Separator />

            {/* Total Amount */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-semibold text-gray-900">Tổng tiền:</span>
              <span className="text-lg font-bold text-primary">
                {order.totalAmount.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bước tiếp theo</h3>
          <div className="space-y-3 text-sm text-gray-600">
            {order.paymentMethod === 'COD' ? (
              <>
                <p>• Đơn hàng đã được xác nhận và đang được xử lý</p>
                <p>• Chúng tôi sẽ liên hệ với bạn để xác nhận thông tin giao hàng</p>
                <p>• Bạn sẽ thanh toán khi nhận được hàng</p>
              </>
            ) : (
              <>
                {order.paymentStatus === 'PAID' ? (
                  <>
                    <p>• Thanh toán đã được xác nhận thành công</p>
                    <p>• Đơn hàng đang được xử lý và chuẩn bị giao hàng</p>
                    <p>• Chúng tôi sẽ thông báo khi đơn hàng được giao</p>
                  </>
                ) : (
                  <>
                    <p>• Vui lòng hoàn tất thanh toán để xử lý đơn hàng</p>
                    <p>• Đơn hàng sẽ được xử lý sau khi thanh toán thành công</p>
                    <p>• Thời gian chờ thanh toán: 30 phút</p>
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={onViewOrderDetail}
        >
          Xem chi tiết đơn hàng
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button 
          className="flex-1" 
          onClick={onCreateNewOrder}
        >
          Tạo đơn hàng mới
        </Button>
      </div>
    </div>
  );
}