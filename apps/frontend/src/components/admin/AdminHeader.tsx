import { Menu, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
    currentPageTitle: string;
    onToggleSidebar: () => void;
    onNavigate: (path: string) => void;
}

export function AdminHeader({
    currentPageTitle,
    onToggleSidebar,
    onNavigate
}: AdminHeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleSidebar}
                        className="lg:hidden"
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {currentPageTitle}
                    </h2>
                </div>

                {/* Header actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('/')}
                        className="hidden sm:flex"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Trang chủ
                    </Button>
                </div>
            </div>
        </header>
    );
} 