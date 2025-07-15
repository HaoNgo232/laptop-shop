import { ChevronLeft, ChevronRight, X, LogOut, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MenuItem {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
}

interface AdminSidebarProps {
    user: any;
    menuItems: MenuItem[];
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    isActive: (path: string) => boolean;
    onToggleSidebar: () => void;
    onToggleCollapse: () => void;
    onMenuClick: (path: string) => void;
    onLogout: () => void;
    onNavigate: (path: string) => void;
}

export function AdminSidebar({
    user,
    menuItems,
    sidebarOpen,
    sidebarCollapsed,
    isActive,
    onToggleSidebar,
    onToggleCollapse,
    onMenuClick,
    onLogout,
    onNavigate,
}: AdminSidebarProps) {
    return (
        <div
            className={cn(
                "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "w-16" : "w-64",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
                "fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 lg:z-auto"
            )}
        >
            <div className="flex flex-col h-full">
                {/* Logo/Brand */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    {!sidebarCollapsed && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('/')}
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Về trang chủ
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleCollapse}
                        className="hidden lg:flex"
                    >
                        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleSidebar}
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
                                onClick={() => onMenuClick(item.path)}
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
                            <DropdownMenuItem onClick={() => onNavigate('/')}>
                                <Home className="mr-2 h-4 w-4" />
                                Về trang chủ
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onNavigate('/profile')}>
                                <User className="mr-2 h-4 w-4" />
                                Hồ sơ cá nhân
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
} 