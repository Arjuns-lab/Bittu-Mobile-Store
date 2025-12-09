import { Product, Order, User, Review } from '../types';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Mobile',
    specs: { ram: '12GB', storage: '256GB', color: 'Titanium Grey' },
    basePrice: 129999,
    wholesalePrice: 115000,
    slabs: [{ minQty: 5, price: 112000 }, { minQty: 10, price: 110000 }],
    stock: 50,
    image: 'https://images.unsplash.com/photo-1610945265078-d86f3d297dfb?auto=format&fit=crop&q=80&w=600',
    description: 'The ultimate AI phone with Snapdragon 8 Gen 3.',
    isNewArrival: true,
    rating: 4.8,
    reviews: [
      { id: 'r1', userId: 'u5', userName: 'City Mobiles', rating: 5, comment: 'Excellent quality and packaging.', date: '2023-11-01' },
      { id: 'r2', userId: 'u6', userName: 'Tech World', rating: 4.5, comment: 'Fast delivery but packaging could be better.', date: '2023-11-05' }
    ]
  },
  {
    id: 'p2',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'Mobile',
    specs: { ram: '8GB', storage: '128GB', color: 'Natural Titanium' },
    basePrice: 134900,
    wholesalePrice: 128000,
    slabs: [{ minQty: 3, price: 127000 }, { minQty: 10, price: 125000 }],
    stock: 30,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=600',
    description: 'Forged in titanium. A17 Pro chip.',
    isNewArrival: true,
    rating: 5.0,
    reviews: [
        { id: 'r3', userId: 'u8', userName: 'Apple Store Rajkot', rating: 5, comment: 'Best wholesale rates in the market.', date: '2023-10-20' }
    ]
  },
  {
    id: 'p3',
    name: 'Redmi Note 13 Pro',
    brand: 'Xiaomi',
    category: 'Mobile',
    specs: { ram: '8GB', storage: '256GB', color: 'Midnight Black' },
    basePrice: 24999,
    wholesalePrice: 21500,
    slabs: [{ minQty: 10, price: 21000 }, { minQty: 20, price: 20500 }],
    stock: 100,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&q=80&w=600',
    description: 'Super-clear 200MP camera with OIS.',
    rating: 4.2,
    reviews: []
  },
  {
    id: 'p4',
    name: 'OnePlus 12R',
    brand: 'OnePlus',
    category: 'Mobile',
    specs: { ram: '16GB', storage: '256GB', color: 'Cool Blue' },
    basePrice: 45999,
    wholesalePrice: 41000,
    slabs: [{ minQty: 5, price: 40500 }, { minQty: 15, price: 39500 }],
    stock: 45,
    image: 'https://images.unsplash.com/photo-1662058498188-468ac8b63e52?auto=format&fit=crop&q=80&w=600',
    description: 'Smooth beyond belief. 5500mAh battery.',
    rating: 4.5,
    reviews: []
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    userId: 'u2',
    userName: 'Rajesh Mobiles',
    items: [
      { ...INITIAL_PRODUCTS[2], quantity: 10, appliedPrice: 21000 }
    ],
    totalAmount: 210000,
    status: 'Delivered',
    date: '2023-10-15',
    shippingAddress: '12, Market Road, Delhi',
  },
  {
    id: 'ord-102',
    userId: 'u2',
    userName: 'Rajesh Mobiles',
    items: [
      { ...INITIAL_PRODUCTS[0], quantity: 5, appliedPrice: 112000 }
    ],
    totalAmount: 560000,
    status: 'Shipped',
    date: '2023-10-20',
    shippingAddress: '12, Market Road, Delhi',
  }
];

// Simple LocalStorage Helper
const save = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
const load = (key: string) => {
  const d = localStorage.getItem(key);
  return d ? JSON.parse(d) : null;
};

// Initialize DB
if (!load('products')) save('products', INITIAL_PRODUCTS);
if (!load('orders')) save('orders', INITIAL_ORDERS);

export const db = {
  getProducts: async (): Promise<Product[]> => {
    return new Promise(resolve => setTimeout(() => resolve(load('products')), 500));
  },
  addProduct: async (product: Product): Promise<void> => {
    const products = load('products') || [];
    save('products', [...products, product]);
  },
  updateProduct: async (product: Product): Promise<void> => {
    const products = load('products') || [];
    const newProducts = products.map((p: Product) => p.id === product.id ? product : p);
    save('products', newProducts);
  },
  deleteProduct: async (id: string): Promise<void> => {
    const products = load('products') || [];
    save('products', products.filter((p: Product) => p.id !== id));
  },
  addReview: async (productId: string, review: Review): Promise<void> => {
      const products = load('products') || [];
      const updatedProducts = products.map((p: Product) => {
        if (p.id === productId) {
          const newReviews = [...(p.reviews || []), review];
          const avgRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
          return { 
            ...p, 
            reviews: newReviews, 
            rating: parseFloat(avgRating.toFixed(1)) 
          };
        }
        return p;
      });
      save('products', updatedProducts);
      return new Promise(resolve => setTimeout(resolve, 500));
  },
  getOrders: async (): Promise<Order[]> => {
    return new Promise(resolve => setTimeout(() => resolve(load('orders')), 500));
  },
  createOrder: async (order: Order): Promise<void> => {
    const orders = load('orders') || [];
    save('orders', [order, ...orders]);
  },
  updateOrderStatus: async (id: string, status: Order['status']): Promise<void> => {
    const orders = load('orders') || [];
    const newOrders = orders.map((o: Order) => o.id === id ? { ...o, status } : o);
    save('orders', newOrders);
  }
};