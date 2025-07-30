import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { CartPage } from '@/pages/CartPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { UserRole } from '@/types';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import ProfilePage from '@/pages/ProfilePage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminManagerUserPage } from '@/pages/admin/AdminManagerUserPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import { useAppLoading } from '@/hooks/useAppLoading';
import LoadingScreen from '@/components/LoadingScreen';
import { AnimatePresence } from 'framer-motion';
import { CategoriesPage } from '@/pages/CategoriesPage';

const App = () => {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const { isLoading } = useAppLoading();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);


  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {!isLoading && (
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders/:orderId"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                  <AdminManagerUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                  <AdminProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                  <AdminOrdersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">404</h1>
                    <p className="text-gray-600">Trang không tồn tại</p>
                    <a href="/" className="text-primary hover:underline">
                      Về trang chủ
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      )}
    </>
  );
};

export default App;