import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, DollarSign, Eye } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/currency';
import type { Order } from '@/types/order';
import { getStatusBadge } from '@/helpers/get-status.badge';

export function OrdersPage() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login', {
                state: { from: '/orders' },
                replace: true
            });
        }
    }, [authLoading, isAuthenticated, navigate]);

    // Load orders
    useEffect(() => {
        const loadOrders = async () => {
            if (isAuthenticated) {
                try {
                    setIsLoading(true);
                    setError(null);
                    const response = await orderService.getUserOrders();
                    setOrders(response.data);
                    setMessage(response.message);
                    console.log('📦 Orders page loaded:', response.data.length, 'Message:', response.message);
                } catch (error: any) {
                    setError(error.message || 'Không thể tải danh sách đơn hàng');
                    setOrders([]);
                    setMessage('');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadOrders();
    }, [isAuthenticated]);

    const handleGoBack = () => {
        navigate(-1);
    };


    // Not authenticated
    if (!isAuthenticated && !authLoading) {
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
                            onClick={handleGoBack}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Quay lại</span>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
                            {message && !isLoading && (
                                <p className="text-sm text-gray-600 mt-1">{message}</p>
                            )}
                        </div>
                    </div>

                    {/* Loading/Error States */}
                    {isLoading && (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {error && (
                        <Card className="max-w-2xl mx-auto">
                            <CardContent className="text-center py-6">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={() => window.location.reload()}>Thử lại</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Orders List */}
                    {!isLoading && !error && orders.length > 0 && (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <h3 className="text-lg font-semibold">
                                                        Đơn hàng #{order.id.slice(0, 8)}
                                                    </h3>
                                                    {getStatusBadge(order.status)}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <DollarSign className="h-4 w-4" />
                                                        <span className="font-medium text-primary">
                                                            {formatCurrency(order.totalAmount)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Package className="h-4 w-4" />
                                                        <span>#{order.id.slice(-8)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/orders/${order.id}`)}
                                                className="flex items-center space-x-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>Chi tiết</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && orders.length === 0 && (
                        <Card className="max-w-2xl mx-auto">
                            <CardHeader>
                                <CardTitle className="text-center">Chưa có đơn hàng nào</CardTitle>
                                <CardDescription className="text-center">
                                    Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <Button onClick={() => navigate('/')}>
                                    Bắt đầu mua sắm
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
} 