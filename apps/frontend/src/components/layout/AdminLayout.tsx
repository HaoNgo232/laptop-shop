import { AdminSidebar } from '../admin/AdminSidebar';
import { AdminHeader } from '../admin/AdminHeader';
import { useAdminLayout } from '@/hooks/useAdminLayout';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const {
        // Data
        user,
        menuItems,
        currentPageTitle,

        // States
        sidebarOpen,
        sidebarCollapsed,

        // Actions
        isActive,
        handleLogout,
        toggleSidebar,
        toggleSidebarCollapse,
        handleMenuClick,
        navigate,
    } = useAdminLayout();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <AdminSidebar
                user={user}
                menuItems={menuItems}
                sidebarOpen={sidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                isActive={isActive}
                onToggleSidebar={toggleSidebar}
                onToggleCollapse={toggleSidebarCollapse}
                onMenuClick={handleMenuClick}
                onLogout={handleLogout}
                onNavigate={navigate}
            />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
                {/* Top Header */}
                <AdminHeader
                    currentPageTitle={currentPageTitle}
                    onToggleSidebar={toggleSidebar}
                    onNavigate={navigate}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-8rem)]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}