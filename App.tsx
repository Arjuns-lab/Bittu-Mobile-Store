import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Auth from './pages/Auth';
import StoreLayout from './pages/store/StoreLayout';
import StoreHome from './pages/store/StoreHome';
import ProductDetail from './pages/store/ProductDetail';
import Cart from './pages/store/Cart';
import OrderHistory from './pages/store/OrderHistory';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import OrderManager from './pages/admin/OrderManager';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }: { children?: React.ReactNode, allowedRole: 'admin' | 'retailer' }) => {
  const { user } = useApp();
  
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to={allowedRole === 'admin' ? '/store' : '/admin'} replace />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/" element={<Navigate to="/store" replace />} />

      {/* Retailer Routes */}
      <Route path="/store" element={
        <ProtectedRoute allowedRole="retailer">
          <StoreLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StoreHome />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="profile" element={<div className="p-8 text-center font-medium">Retailer Profile Settings</div>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="users" element={<div className="p-8 text-center font-medium">Retailer Management Screen</div>} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}