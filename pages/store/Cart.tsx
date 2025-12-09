import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Input } from '../../components/UIComponents';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { db } from '../../services/mockDatabase';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, cartTotal, clearCart, user, refreshOrders } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState('123, Retailer Lane, Mobile Market, Delhi - 110001');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!cart.length) return;
    setLoading(true);
    
    // Simulate API Delay
    setTimeout(async () => {
      const newOrder = {
        id: `ord-${Math.floor(Math.random() * 10000)}`,
        userId: user?.id || 'guest',
        userName: user?.name || 'Guest',
        items: cart,
        totalAmount: cartTotal,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        shippingAddress: address
      };
      
      // @ts-ignore
      await db.createOrder(newOrder);
      await refreshOrders();
      clearCart();
      setLoading(false);
      alert('Order Placed Successfully! Invoice sent to email.');
      navigate('/store/orders');
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm">
        <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-medium text-slate-900">Your Cart is Empty</h2>
        <Button onClick={() => navigate('/store')} className="mt-4" variant="outline">Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold mb-4">Shopping Cart ({cart.length})</h2>
        {cart.map(item => (
          <Card key={item.id} className="p-4 flex gap-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-slate-100 rounded-md" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-500">Variant: {item.specs.ram}/{item.specs.storage}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div className="text-sm text-slate-600">
                  Qty: <span className="font-bold">{item.quantity}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">₹{item.appliedPrice.toLocaleString()} / unit</p>
                  <p className="font-bold text-lg text-brand-blue">₹{(item.appliedPrice * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Checkout Summary */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">GST (18%)</span>
              <span className="font-medium">₹{(cartTotal * 0.18).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>₹{(cartTotal * 1.18).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mb-4">
             <label className="block text-sm font-medium text-slate-700 mb-1">Shipping Address</label>
             <textarea 
               className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
               rows={3}
               value={address}
               onChange={(e) => setAddress(e.target.value)}
             />
          </div>

          <Button 
            onClick={handleCheckout} 
            className="w-full flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? 'Processing...' : (
              <>Checkout <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
          <p className="text-xs text-center mt-3 text-slate-400">Secure Payment via Razorpay/Bank Transfer</p>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
