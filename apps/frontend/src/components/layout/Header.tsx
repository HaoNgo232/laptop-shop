import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, User, ShoppingBag, LogIn, UserPlus, LogOut, ChartBar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MiniCart } from '@/components/cart/MiniCart';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@web-ecom/shared-types/auth/enums';

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Navigation items
    const publicNavItems = [
        { label: 'Trang chủ', path: '/', icon: Home },
        { label: 'Sản phẩm', path: '/products', icon: Package },
        { label: 'Danh mục', path: '/categories', icon: ShoppingBag },
    ];

    const userNavItems = [
        { label: 'Tài khoản', path: '/profile', icon: User },
    ];

    const adminNavItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: ChartBar },
    ];

    // Check if path is active
    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo và Navigation */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <h1 className="text-xl font-bold text-primary">TechNow</h1>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {publicNavItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Button
                                        key={item.path}
                                        variant={isActive(item.path) ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => navigate(item.path)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                );
                            })}

                            {/* User-specific navigation */}
                            {isAuthenticated && userNavItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Button
                                        key={item.path}
                                        variant={isActive(item.path) ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => navigate(item.path)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                );
                            })}

                            {/** Admin navigation */}
                            {isAuthenticated && user?.role === UserRole.ADMIN && adminNavItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    < Button
                                        key={item.path}
                                        variant={isActive(item.path) ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => navigate(item.path)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* MiniCart - chỉ hiển thị cho authenticated users */}
                        {isAuthenticated && <MiniCart />}

                        {/* User actions */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-700 hidden sm:inline">
                                    Xin chào, {user?.username}!
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Đăng xuất</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate('/login')}
                                    className="flex items-center space-x-2"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span className="hidden sm:inline">Đăng nhập</span>
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/register')}
                                    className="flex items-center space-x-2"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span className="hidden sm:inline">Đăng ký</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t py-3">
                    <nav className="flex justify-around">
                        {publicNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={item.path}
                                    variant={isActive(item.path) ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => navigate(item.path)}
                                    className="flex flex-col items-center space-y-1 h-auto py-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="text-xs">{item.label}</span>
                                </Button>
                            );
                        })}

                        {isAuthenticated && (
                            <Button
                                variant={isActive('/profile') ? "default" : "ghost"}
                                size="sm"
                                onClick={() => navigate('/profile')}
                                className="flex flex-col items-center space-y-1 h-auto py-2"
                            >
                                <User className="h-4 w-4" />
                                <span className="text-xs">Tài khoản</span>
                            </Button>
                        )}
                    </nav>
                </div>
            </div>
        </header >
    );
} 