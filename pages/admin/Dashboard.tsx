import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UIComponents';
import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card className="p-6 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  </Card>
);

const Dashboard = () => {
  const { orders, products } = useApp();

  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lowStock = products.filter(p => p.stock < 20).length;
    return {
      sales: totalSales,
      count: orders.length,
      products: products.length,
      lowStock
    };
  }, [orders, products]);

  const chartData = [
    { name: 'Mon', sales: 40000 },
    { name: 'Tue', sales: 30000 },
    { name: 'Wed', sales: 20000 },
    { name: 'Thu', sales: 27800 },
    { name: 'Fri', sales: 18900 },
    { name: 'Sat', sales: 23900 },
    { name: 'Sun', sales: 34900 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sales" value={`₹${(stats.sales / 100000).toFixed(2)}L`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Total Orders" value={stats.count} icon={ShoppingCart} color="bg-blue-500" />
        <StatCard title="Total Products" value={stats.products} icon={Package} color="bg-indigo-500" />
        <StatCard title="Low Stock Alert" value={stats.lowStock} icon={AlertTriangle} color="bg-red-500" />
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold mb-4 text-lg">Weekly Sales Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-4 text-lg">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-3 py-2">Order ID</th>
                  <th className="px-3 py-2">Retailer</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id}>
                    <td className="px-3 py-3 font-medium">{order.id}</td>
                    <td className="px-3 py-3">{order.userName}</td>
                    <td className="px-3 py-3">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
