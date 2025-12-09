export type UserRole = 'admin' | 'retailer' | 'guest';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  shopName?: string;
  gstNumber?: string;
}

export interface PricingSlab {
  minQty: number;
  price: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Mobile' | 'Accessory';
  specs: {
    ram?: string;
    storage?: string;
    battery?: string;
    processor?: string;
    color?: string;
  };
  basePrice: number; // Retail price reference
  wholesalePrice: number; // Base wholesale price
  slabs: PricingSlab[]; // Bulk pricing logic
  stock: number;
  image: string;
  description: string;
  isNewArrival?: boolean;
  reviews: Review[];
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
  appliedPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  shippingAddress: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}