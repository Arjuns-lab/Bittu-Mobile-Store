import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge } from '../../components/UIComponents';
import { Package, Truck, CheckCircle, Clock, Search, Eye, ThumbsUp, XCircle, AlertCircle } from 'lucide-react';
import { Order } from '../../types';

const OrderManager = () => {
  const { orders, updateOrderStatus } = useApp();
  const [filter, setFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => filter === 'All' || o.status === filter);

  const statusOptions: Order['status'][] = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (newStatus === 'Cancelled' && !confirm('Are you sure you want to cancel this order?')) return;
    await updateOrderStatus(orderId, newStatus as Order['status']);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>

      <div className="flex flex-wrap gap-2">
        {['All', ...statusOptions].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === status 
                ? 'bg-brand-blue text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Retailer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{order.userName}</div>
                      <div className="text-xs text-slate-500">ID: {order.userId}</div>
                    </td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4 font-bold">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-semibold border-none focus:ring-2 cursor-pointer outline-none ${
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Packed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                         {statusOptions.map(opt => (
                           <option key={opt} value={opt}>{opt}</option>
                         ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Next Step Workflow Buttons */}
                        {order.status === 'Pending' && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'Packed'); }}
                                className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded text-xs font-medium transition-colors"
                                title="Mark as Packed"
                            >
                                <Package className="w-3 h-3" /> Pack
                            </button>
                        )}
                        {order.status === 'Packed' && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'Shipped'); }}
                                className="flex items-center gap-1 text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-1 rounded text-xs font-medium transition-colors"
                                title="Mark as Shipped"
                            >
                                <Truck className="w-3 h-3" /> Ship
                            </button>
                        )}
                        {order.status === 'Shipped' && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'Delivered'); }}
                                className="flex items-center gap-1 text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 px-2 py-1 rounded text-xs font-medium transition-colors"
                                title="Mark as Delivered"
                            >
                                <CheckCircle className="w-3 h-3" /> Deliver
                            </button>
                        )}

                        {/* Cancel Button (Only for active orders) */}
                        {(order.status === 'Pending' || order.status === 'Packed') && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'Cancelled'); }}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Cancel Order"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}

                        {/* View Button */}
                        <button 
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="text-slate-400 hover:text-brand-blue p-1 rounded hover:bg-slate-100 transition-colors"
                            title="View Details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr className="bg-slate-50 animate-in fade-in">
                      <td colSpan={6} className="px-6 py-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Order Items</h4>
                             <ul className="space-y-2">
                               {order.items.map((item, idx) => (
                                 <li key={idx} className="flex justify-between text-sm">
                                   <span>{item.quantity}x {item.name} <span className="text-slate-500">({item.specs.ram}/{item.specs.storage})</span></span>
                                   <span className="font-medium">₹{(item.appliedPrice * item.quantity).toLocaleString()}</span>
                                 </li>
                               ))}
                             </ul>
                           </div>
                           <div>
                             <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Shipping Details</h4>
                             <p className="text-sm text-slate-700">{order.shippingAddress}</p>
                             <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                                <button className="text-xs text-brand-blue font-medium hover:underline">Download Invoice</button>
                                <span className="text-slate-300">|</span>
                                <button className="text-xs text-brand-blue font-medium hover:underline">Print Label</button>
                             </div>
                           </div>
                         </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OrderManager;