import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, LogOut, User, Menu, Smartphone, Home } from 'lucide-react';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';

const StoreLayout = () => {
  const { cart, user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if we are on the home page to conditionally hide the standard header
  const isHome = location.pathname === '/store' || location.pathname === '/store/';

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header - Hidden on Home Page for Custom Design */}
      {!isHome && (
        <header className="bg-brand-dark text-white sticky top-0 z-50 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-6 w-6 text-brand-accent" />
                <span className="font-bold text-xl tracking-tight">Bittu Mobiles</span>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <Link to="/store" className="hover:text-brand-accent transition-colors">Home</Link>
                <Link to="/store" className="hover:text-brand-accent transition-colors">Mobiles</Link>
                <Link to="/store/orders" className="hover:text-brand-accent transition-colors">My Orders</Link>
              </nav>

              <div className="flex items-center space-x-4">
                <ThemeSwitcher />
                <Link to="/store/cart" className="relative p-2 hover:bg-slate-800 rounded-full">
                  <ShoppingCart className="h-6 w-6" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-2 border-l border-slate-700 pl-4 ml-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">Retailer</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 hover:text-red-400">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link to="/store" className={`flex flex-col items-center ${isHome ? 'text-brand-blue' : 'text-slate-400 hover:text-slate-600'}`}>
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link to="/store/cart" className={`flex flex-col items-center ${location.pathname.includes('cart') ? 'text-brand-blue' : 'text-slate-400 hover:text-slate-600'}`}>
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3 h-3 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Cart</span>
        </Link>
        <Link to="/store/orders" className={`flex flex-col items-center ${location.pathname.includes('orders') ? 'text-brand-blue' : 'text-slate-400 hover:text-slate-600'}`}>
          <Menu className="h-6 w-6" />
          <span className="text-[10px] font-medium mt-1">Orders</span>
        </Link>
        <Link to="/store/profile" className={`flex flex-col items-center ${location.pathname.includes('profile') ? 'text-brand-blue' : 'text-slate-400 hover:text-slate-600'}`}>
          <User className="h-6 w-6" />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default StoreLayout;