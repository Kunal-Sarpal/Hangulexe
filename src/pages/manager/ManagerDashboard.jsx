import { useState, useEffect } from 'react';
import { apiGetManagerDashboard } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import Icons from '../../components/Icons';
import StatusBadge from '../../components/ui/StatusBadge';
import { AdminCard, AdminStatCard } from '../../components/ui/AdminCard';

const ManagerDashboard = ({ navigateTo }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiGetManagerDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-center text-xs text-zinc-400 font-medium">Loading store metrics...</div>;

  return (
    <div className="space-y-6 animate-fade-in text-left">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/90 pb-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Real-time overview of orders, revenue, inventory and sales metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('inventory')}
            className="cursor-pointer group relative inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-black bg-opacity-90 text-[#f1f1f1] rounded-full hover:bg-opacity-75 transition-all font-semibold shadow-md active:scale-95 text-xs"
          >
            <Icons.Plus className="w-3.5 h-3.5" />
            <span>Manage Inventory</span>
          </button>
        </div>
      </div>

      {/* Reusable AdminStatCard Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Revenue"
          value={formatCurrency(data.stats.totalRevenue)}
          subtext="▲ 12.5% vs last month"
          icon="💰"
          onClick={() => navigateTo('reports')}
        />
        <AdminStatCard
          label="Orders Today"
          value={data.stats.ordersToday}
          subtext="▲ 8 more than yesterday"
          icon="📦"
          onClick={() => navigateTo('orders')}
        />
        <AdminStatCard
          label="Low Stock Items"
          value={data.stats.lowStock}
          subtext="Action needed"
          icon="⚠️"
          onClick={() => navigateTo('inventory')}
        />
        <AdminStatCard
          label="Active Coupons"
          value={data.stats.activeCoupons}
          subtext="Currently running live"
          icon="🏷️"
          onClick={() => navigateTo('coupons')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly Revenue Card */}
        <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none overflow-hidden transition-all duration-300">
          <div className="px-5 py-3.5 border-b border-zinc-200/90 flex items-center justify-between bg-zinc-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Monthly Revenue Overview
            </h3>
            <span className="text-[10px] bg-zinc-100 text-zinc-700 font-bold px-2 py-0.5 rounded">
              Current Year
            </span>
          </div>
          <div className="p-5">
            <BarChart data={data.monthlyRevenue} />
          </div>
        </div>

        {/* Category-wise Inventory Card */}
        <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none overflow-hidden transition-all duration-300">
          <div className="px-5 py-3.5 border-b border-zinc-200/90 flex items-center justify-between bg-zinc-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Category-Wise Stock Distribution
            </h3>
            <span className="text-[10px] bg-zinc-100 text-zinc-700 font-bold px-2 py-0.5 rounded">
              Units
            </span>
          </div>
          <div className="p-5">
            <DonutChart data={data.categoryData} />
          </div>
        </div>

      </div>

      {/* Recent Orders Table in AdminCard */}
      <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none overflow-hidden transition-all duration-300">
        <div className="px-5 py-3.5 border-b border-zinc-200/90 flex items-center justify-between bg-zinc-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Recent Customer Orders
          </h3>
          <button
            onClick={() => navigateTo('orders')}
            className="text-xs text-zinc-900 hover:underline font-bold cursor-pointer"
          >
            View All Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200/90 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/90 text-xs font-medium text-zinc-800">
              {data.recentOrders.map((o, i) => (
                <tr key={i} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-5">
                    <button
                      onClick={() => navigateTo('orders')}
                      className="font-machina font-bold text-zinc-900 hover:underline cursor-pointer"
                    >
                      {o.id}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-semibold text-zinc-900">{o.customer}</td>
                  <td className="py-3 px-4 text-zinc-500 font-machina">{o.items}</td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-900 font-machina">
                    {formatCurrency(o.total)}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <div className="flex items-center justify-center">
                      <StatusBadge status={o.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;
