import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button } from '../../components/UIComponents';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Order } from '../../types';

const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Packed: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
  };

  const icons = {
    Pending: Clock,
    Packed: Package,
    Shipped: Truck,
    Delivered: CheckCircle,
    Cancelled: XCircle
  };

  const Icon = icons[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

const OrderHistory = () => {
  const { orders, user } = useApp();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Filter orders for the logged-in retailer
  const myOrders = orders.filter(o => o.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (myOrders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-medium text-slate-900">No Orders Yet</h2>
        <p className="text-slate-500 mt-2">Start adding products to your cart to make a purchase.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">My Orders</h1>
      
      <div className="space-y-4">
        {myOrders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            <div 
              className="p-4 sm:p-6 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">#{order.id}</span>
                    <span className="text-sm text-slate-500">• {order.date}</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    {order.items.length} items • Total: <span className="font-bold text-slate-900">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <OrderStatusBadge status={order.status} />
                  {expandedOrder === order.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-6 animate-in slide-in-from-top-2">
                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="font-medium text-slate-700">Shipping Address:</p>
                    <p className="text-slate-600">{order.shippingAddress}</p>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500 text-left">
                        <tr>
                          <th className="px-4 py-2 font-medium">Product</th>
                          <th className="px-4 py-2 font-medium text-right">Qty</th>
                          <th className="px-4 py-2 font-medium text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={item.image} className="w-8 h-8 rounded bg-slate-100 object-cover" alt="" />
                                <div>
                                  <p className="font-medium text-slate-900">{item.name}</p>
                                  <p className="text-xs text-slate-500">{item.specs.ram}/{item.specs.storage}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-medium">₹{(item.appliedPrice * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      Download Invoice
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;