import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Plus, Minus, Smartphone, Headphones, Watch, Tablet, BatteryCharging, ShoppingBag, ArrowRight, Star, Eye, X, Check, Info, ArrowUpDown } from 'lucide-react';
import { Product } from '../../types';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';

// Category Icons Map
const categoryIcons: Record<string, React.ElementType> = {
  'Mobile': Smartphone,
  'Accessory': Headphones,
  'Tablet': Tablet,
  'Watch': Watch,
  'Power': BatteryCharging,
  'All': ShoppingBag,
};

// Hook for cart logic to reuse in cards
const useProductCart = (product: Product) => {
  const { cart, addToCart, updateCartQuantity } = useApp();
  
  const qty = cart.find(i => i.id === product.id)?.quantity || 0;

  const handleQuantityChange = (newQty: number) => {
    if (qty === 0 && newQty === 1) {
      addToCart(product, 1);
    } else {
      updateCartQuantity(product.id, newQty);
    }
  };

  return { qty, handleQuantityChange };
};

// Reusable Product Card Component (Vertical for Grid)
const ProductCard: React.FC<{ product: Product; onQuickView: (p: Product) => void }> = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { qty, handleQuantityChange } = useProductCart(product);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      {/* 1. Image Area - Prominent display */}
      <div 
        className="relative aspect-square w-full bg-slate-50 overflow-hidden cursor-pointer group-hover:bg-slate-100/50 transition-colors" 
        onClick={() => navigate(`/store/product/${product.id}`)}
      >
         {/* New Arrival Badge */}
         {product.isNewArrival && (
            <span className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                New
            </span>
         )}
         
         <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out" 
         />
         
         {/* Quick View - Subtle Overlay Button */}
         <button
            onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
            }}
            className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-md text-slate-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md hover:bg-brand-blue hover:text-white border border-slate-200 hover:border-transparent"
            title="Quick View"
        >
            <Eye className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col p-4">
        {/* 2. Product Name */}
        <h3 
            className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1.5 cursor-pointer hover:text-brand-blue transition-colors"
            onClick={() => navigate(`/store/product/${product.id}`)}
        >
            {product.name}
        </h3>

        {/* 3. Brand & Specs */}
        <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{product.brand}</span>
             <span className="text-[10px] text-slate-400">
                {product.specs.ram ? `${product.specs.ram}/${product.specs.storage}` : product.category}
            </span>
        </div>
        
        {/* 4. Pricing & Actions */}
        <div className="mt-auto flex items-end justify-between pt-3 border-t border-slate-50">
          <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 line-through">MRP: ₹{product.basePrice.toLocaleString()}</span>
              <span className="text-lg font-bold text-brand-blue leading-none">₹{product.wholesalePrice.toLocaleString()}</span>
          </div>
          
          {/* Quantity Control */}
          {qty > 0 ? (
            <div className="flex items-center bg-brand-blue rounded-lg h-9 shadow-lg shadow-brand-blue/20 overflow-hidden">
              <button 
                onClick={() => handleQuantityChange(qty - 1)}
                className="w-8 h-full flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-white text-xs font-bold w-6 text-center">{qty}</span>
              <button 
                onClick={() => handleQuantityChange(qty + 1)}
                className="w-8 h-full flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleQuantityChange(1)}
              className="bg-slate-50 hover:bg-brand-blue hover:text-white text-brand-blue border border-slate-200 hover:border-brand-blue rounded-xl w-9 h-9 flex items-center justify-center transition-all duration-300 shadow-sm"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Horizontal Card Component
const HorizontalProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const { qty, handleQuantityChange } = useProductCart(product);

  return (
    <div className="min-w-[140px] w-[140px] bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-all">
      <div 
        className="relative aspect-square bg-slate-50 rounded-xl mb-3 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/store/product/${product.id}`)}
      >
        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
        {product.isNewArrival && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
      </div>
      <h3 className="font-bold text-slate-900 text-xs leading-tight line-clamp-1 mb-1">{product.name}</h3>
      <p className="text-[10px] text-slate-500 mb-2">{product.brand}</p>
      <div className="mt-auto flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900">₹{(product.wholesalePrice / 1000).toFixed(1)}k</p>
          {qty > 0 ? (
            <div className="flex items-center gap-1 bg-brand-blue rounded-md px-1 py-0.5">
                <span className="text-white text-[10px] font-bold">{qty}</span>
            </div>
          ) : (
            <button 
              onClick={() => handleQuantityChange(1)}
              className="bg-green-100 text-green-700 rounded-md p-1 hover:bg-green-200 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
      </div>
    </div>
  );
};

const StoreHome = () => {
  const { products, cart, addToCart } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high'>('default');
  
  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });

    // Sorting Logic
    if (sortBy === 'price_low') {
      result = result.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    } else if (sortBy === 'price_high') {
      result = result.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
    }
    
    return result;
  }, [products, searchTerm, selectedBrand, sortBy]);

  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 5);
  const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];

  // Quick View Logic
  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewQty(1);
  };

  const handleQuickViewAdd = () => {
    if (quickViewProduct) {
        addToCart(quickViewProduct, quickViewQty);
        setQuickViewProduct(null);
    }
  };

  // Helper to calculate price inside modal
  const getQuickViewPrice = (product: Product, quantity: number) => {
    let price = product.wholesalePrice;
    const sortedSlabs = [...product.slabs].sort((a, b) => b.minQty - a.minQty);
    for (const slab of sortedSlabs) {
      if (quantity >= slab.minQty) {
        price = slab.price;
        break;
      }
    }
    return price;
  };

  const qvPrice = quickViewProduct ? getQuickViewPrice(quickViewProduct, quickViewQty) : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans relative">
      
      {/* Header Section */}
      <div className="bg-brand-dark text-white rounded-b-[2rem] px-6 pt-6 pb-8 shadow-xl relative z-10 transition-colors duration-500">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
             <div className="flex items-center text-brand-accent mb-1">
               <MapPin className="w-4 h-4 mr-1" />
               <span className="text-xs font-medium">Delivering to</span>
             </div>
             <h2 className="text-lg font-bold flex items-center gap-1">
               New Delhi, India <ArrowRight className="w-4 h-4 opacity-50" />
             </h2>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <div 
                onClick={() => navigate('/store/cart')}
                className="bg-slate-800 p-2.5 rounded-full relative cursor-pointer hover:bg-slate-700 transition-colors"
            >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-brand-dark">
                    {cart.length}
                </span>
                )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search for 'Samsung S24'..." 
            className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-brand-accent/20 outline-none shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 -mt-4 relative z-20 space-y-8">
        
        {/* Categories Horizontal Scroll */}
        <div className="overflow-x-auto no-scrollbar pt-4">
          <div className="flex gap-6 min-w-max px-1">
            {brands.map((brand, idx) => {
               // Assign pseudo-random icons for demo
               const Icon = categoryIcons['Mobile']; 
               const isActive = selectedBrand === brand;
               
               return (
                <button 
                  key={brand} 
                  onClick={() => setSelectedBrand(brand)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isActive ? 'bg-brand-blue text-white scale-110 shadow-brand-blue/30' : 'bg-white text-slate-400 hover:bg-white hover:text-brand-blue'}`}>
                     {brand === 'All' ? <ShoppingBag className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-brand-dark' : 'text-slate-500'}`}>{brand}</span>
                </button>
               );
            })}
          </div>
        </div>

        {/* "You might need" / New Arrivals */}
        {newArrivals.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-900">New Arrivals</h3>
               <button className="text-brand-blue text-xs font-medium hover:underline">See more</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
               {newArrivals.map(product => (
                 <HorizontalProductCard key={product.id} product={product} />
               ))}
            </div>
          </div>
        )}

        {/* Dual Info Cards */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-orange-50 rounded-2xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer border border-orange-100">
              <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-orange-100 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
              <div className="z-10 relative">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Retail</p>
                <h4 className="font-bold text-slate-900 leading-tight">Fast<br/>Delivery</h4>
                <p className="text-[10px] text-slate-500 mt-1">By 5:00 PM</p>
              </div>
              <div className="z-10 relative self-end bg-white rounded-full p-1.5 shadow-sm">
                <ArrowRight className="w-4 h-4 text-orange-500" />
              </div>
           </div>
           
           <div className="bg-blue-50 rounded-2xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer border border-blue-100">
              <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-blue-100 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
              <div className="z-10 relative">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Wholesale</p>
                <h4 className="font-bold text-slate-900 leading-tight">Bulk<br/>Order</h4>
                <p className="text-[10px] text-slate-500 mt-1">Huge Savings</p>
              </div>
              <div className="z-10 relative self-end bg-white rounded-full p-1.5 shadow-sm">
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </div>
           </div>
        </div>

        {/* Main Product Grid */}
        <div>
           <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-900">All Products</h3>
               <div className="relative">
                 <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white border border-slate-200 pl-3 pr-8 py-2 rounded-lg text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-blue/20 cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                 >
                    <option value="default">Sort by: Default</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                 </select>
                 <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onQuickView={handleOpenQuickView} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-500">No products found matching your criteria.</p>
              </div>
            )}
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3 right-3 z-10 p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative">
               <img src={quickViewProduct.image} alt={quickViewProduct.name} className="max-h-64 object-contain drop-shadow-lg" />
               {quickViewProduct.isNewArrival && (
                 <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">New Arrival</span>
               )}
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-1/2 p-6 flex flex-col">
               <div className="mb-4">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="text-xs font-bold text-brand-blue uppercase tracking-wide">{quickViewProduct.brand}</span>
                   <div className="flex items-center text-yellow-500 text-[10px] font-bold">
                     <Star className="w-3 h-3 fill-current mr-0.5" /> {quickViewProduct.rating}
                   </div>
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">{quickViewProduct.name}</h2>
                 
                 {/* Specs Tags */}
                 <div className="flex flex-wrap gap-1.5 mb-3">
                    {quickViewProduct.specs.ram && <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600">{quickViewProduct.specs.ram}</span>}
                    {quickViewProduct.specs.storage && <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600">{quickViewProduct.specs.storage}</span>}
                    {quickViewProduct.specs.color && <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600">{quickViewProduct.specs.color}</span>}
                 </div>

                 <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{quickViewProduct.description}</p>
               </div>

               {/* Dynamic Pricing Highlight */}
               <div className="bg-brand-light border border-brand-blue/10 rounded-xl p-3 mb-4">
                 <div className="flex justify-between items-end mb-1">
                   <span className="text-xs text-slate-500">Wholesale Price (per unit)</span>
                   <span className="text-lg font-bold text-brand-blue">₹{qvPrice.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="line-through">MRP: ₹{quickViewProduct.basePrice.toLocaleString()}</span>
                    <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                      Save ₹{(quickViewProduct.basePrice - qvPrice).toLocaleString()}
                    </span>
                 </div>
               </div>

               {/* Footer Actions */}
               <div className="mt-auto">
                 <div className="flex gap-3 h-11">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-1">
                      <button 
                        onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                        className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded transition-colors"
                      >-</button>
                      <span className="w-8 text-center font-bold text-slate-900 text-sm">{quickViewQty}</span>
                      <button 
                        onClick={() => setQuickViewQty(quickViewQty + 1)}
                        className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded transition-colors"
                      >+</button>
                    </div>
                    <button 
                      onClick={handleQuickViewAdd}
                      className="flex-1 bg-brand-blue hover:bg-brand-dark text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                 </div>
                 <button 
                    onClick={() => navigate(`/store/product/${quickViewProduct.id}`)}
                    className="w-full text-center text-xs text-slate-400 mt-3 hover:text-brand-blue transition-colors flex items-center justify-center gap-1"
                 >
                    View Full Details <ArrowRight className="w-3 h-3" />
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoreHome;