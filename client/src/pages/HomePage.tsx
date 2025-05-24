import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Web Ecommerce</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-sm text-gray-700">
                                        Xin chào, {user?.username}!
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate('/login')}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => navigate('/register')}
                                    >
                                        Đăng ký
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Chào mừng đến với Web Ecommerce!</CardTitle>
                            <CardDescription>
                                {isAuthenticated
                                    ? 'Bạn đã đăng nhập thành công. Bắt đầu mua sắm ngay!'
                                    : 'Vui lòng đăng nhập hoặc đăng ký để bắt đầu mua sắm.'
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isAuthenticated && user && (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-2">Thông tin tài khoản:</h3>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Tên người dùng:</strong> {user.username}</p>
                                            <p><strong>Vai trò:</strong> {user.role}</p>
                                            {user.address && <p><strong>Địa chỉ:</strong> {user.address}</p>}
                                            {user.phone_number && <p><strong>Số điện thoại:</strong> {user.phone_number}</p>}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button onClick={() => navigate('/profile')}>
                                            Cập nhật thông tin
                                        </Button>
                                        <Button variant="outline">
                                            Xem sản phẩm
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!isAuthenticated && (
                                <div className="text-center space-y-4">
                                    <p className="text-gray-600">
                                        Bạn chưa đăng nhập. Đăng nhập ngay để trải nghiệm đầy đủ các tính năng!
                                    </p>
                                    <div className="flex justify-center space-x-2">
                                        <Button onClick={() => navigate('/login')}>
                                            Đăng nhập
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate('/register')}
                                        >
                                            Đăng ký
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
} 