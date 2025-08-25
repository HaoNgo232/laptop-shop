import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { LayoutDashboard, Users, Package, ShoppingCart } from "lucide-react";

export function useAdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // Load sidebar preferences from localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-open');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Menu items configuration
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Người dùng",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Sản phẩm",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Đơn hàng",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Danh mục",
      path: "/admin/categories",
      icon: Package,
    },
  ];

  // Check if current path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    return (
      menuItems.find((item) => isActive(item.path))?.label || "Admin Panel"
    );
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Navigate anyway vì logout clears local state
      navigate("/login");
    }
  };

  // Sidebar controls
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('admin-sidebar-open', JSON.stringify(newState));
  };

  const toggleSidebarCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(newState));
  };

  // Menu navigation
  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return {
    // Data
    user,
    menuItems,
    currentPageTitle: getCurrentPageTitle(),

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
  };
}
