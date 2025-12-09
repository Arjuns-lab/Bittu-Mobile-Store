import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, CartItem, Review } from '../types';
import { db } from '../services/mockDatabase';

interface AppContextType {
  user: User | null;
  login: (role: 'admin' | 'retailer', phone: string) => void;
  logout: () => void;
  products: Product[];
  refreshProducts: () => void;
  orders: Order[];
  refreshOrders: () => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  addReview: (productId: string, rating: number, comment: string) => Promise<void>;
  
  // Theme Management
  theme: string;
  setTheme: (theme: string) => void;

  // Admin Functions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Theme State
  const [theme, setThemeState] = useState(() => localStorage.getItem('app-theme') || 'blue');

  // Theme Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
  };

  useEffect(() => {
    refreshProducts();
    refreshOrders();
  }, []);

  const refreshProducts = async () => {
    const data = await db.getProducts();
    setProducts(data);
  };

  const refreshOrders = async () => {
    const data = await db.getOrders();
    setOrders(data);
  };

  const login = (role: 'admin' | 'retailer', phone: string) => {
    // Simulated Login
    setUser({
      id: role === 'admin' ? 'admin1' : 'u2',
      name: role === 'admin' ? 'Bittu Admin' : 'Rajesh Mobiles',
      phone,
      role,
      shopName: role === 'retailer' ? 'Rajesh Mobiles Pvt Ltd' : undefined,
      gstNumber: role === 'retailer' ? '29AAAAA0000A1Z5' : undefined,
    });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const calculateBulkPrice = (product: Product, qty: number) => {
    let finalPrice = product.wholesalePrice;
    // Find highest applicable slab
    const applicableSlab = [...product.slabs]
      .sort((a, b) => b.minQty - a.minQty)
      .find(slab => qty >= slab.minQty);
    
    if (applicableSlab) {
      finalPrice = applicableSlab.price;
    }
    return finalPrice;
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        return prev.map(item => item.id === product.id ? {
          ...item,
          quantity: newQty,
          appliedPrice: calculateBulkPrice(product, newQty)
        } : item);
      }
      return [...prev, {
        ...product,
        quantity,
        appliedPrice: calculateBulkPrice(product, quantity)
      }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      // Need to find the product to recalculate price. 
      // In a real app, we might fetch it, here we assume it's in the cart or we look it up in products if needed.
      // But since we are updating an existing cart item, we have the base data in the item (CartItem extends Product)
      return prev.map(item => {
        if (item.id === productId) {
          return {
            ...item,
            quantity,
            appliedPrice: calculateBulkPrice(item, quantity)
          };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const addReview = async (productId: string, rating: number, comment: string) => {
    if (!user) return;
    const newReview: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    // @ts-ignore
    await db.addReview(productId, newReview);
    await refreshProducts();
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.appliedPrice * item.quantity), 0);

  // Admin Actions
  const addProduct = async (product: Product) => {
    await db.addProduct(product);
    await refreshProducts();
  };

  const updateProduct = async (product: Product) => {
    // @ts-ignore
    await db.updateProduct(product);
    await refreshProducts();
  };

  const deleteProduct = async (productId: string) => {
    await db.deleteProduct(productId);
    await refreshProducts();
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    await refreshOrders();
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      products, refreshProducts,
      orders, refreshOrders,
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart, cartTotal, addReview,
      theme, setTheme,
      addProduct, updateProduct, deleteProduct, updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};