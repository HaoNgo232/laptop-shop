import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from "@/components/layout/Header";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard',
        },
        {
            label: 'Người dùng',
            path: '/admin/users',
            icon: Users,
        },
        {
            label: 'Sản phẩm',
            path: '/admin/products',
            icon: Package,
        },
        {
            label: 'Đơn hàng',
            path: '/admin/orders',
            icon: ShoppingCart,
        },
        {
            label: 'Danh mục',
            path: '/admin/categories',
            icon: Package,
        }
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSidebarCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleMenuClick = (path: string) => {
        navigate(path);
    };

    return (
        <>
            <Header />
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <div
                    className={cn(
                        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
                        sidebarCollapsed ? "w-16" : "w-64",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full",
                        "fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0"
                    )}
                >
                    <div className="flex flex-col h-full">
                        {/* Logo/Brand */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            {!sidebarCollapsed && (
                                <h1 className="text-xl font-bold text-gray-900">
                                    Admin Panel
                                </h1>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleSidebarCollapse}
                                className="hidden lg:flex"
                            >
                                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleSidebar}
                                className="lg:hidden"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="flex-1 p-4 space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <Button
                                        key={item.path}
                                        variant={active ? "default" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            sidebarCollapsed && "justify-center"
                                        )}
                                        onClick={() => handleMenuClick(item.path)}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {!sidebarCollapsed && (
                                            <span className="text-sm">{item.label}</span>
                                        )}
                                    </Button>
                                );
                            })}
                        </nav>

                        {/* User Profile */}
                        <div className="p-4 border-t border-gray-200">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start gap-3 p-2",
                                            sidebarCollapsed && "justify-center"
                                        )}
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.avatarUrl} />
                                            <AvatarFallback>
                                                {user?.username?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {!sidebarCollapsed && (
                                            <div className="flex flex-col items-start text-left">
                                                <span className="text-sm font-medium">
                                                    {user?.username}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {user?.email}
                                                </span>
                                            </div>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                                        Hồ sơ cá nhân
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Top Header */}
                    <header className="bg-white border-b border-gray-200 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleSidebar}
                                    className="lg:hidden"
                                >
                                    <Menu className="h-4 w-4" />
                                </Button>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {menuItems.find(item => isActive(item.path))?.label || 'Admin Panel'}
                                </h2>
                            </div>

                            {/* Additional header actions can be added here */}
                            <div className="flex items-center gap-2">
                                {/* Add notifications, search, etc. */}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}