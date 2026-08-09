import { useState, useEffect } from 'react';
import { apiGetManagerDashboard } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatCard from '../../components/ui/StatCard';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';

const ManagerDashboard = ({ navigateTo }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiGetManagerDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="animate-fade-in p-8 text-center text-slate-400">Loading dashboard…</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="dashboard-title">Dashboard</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Welcome back — here's your store overview</p>
      </div>
      
      <div className="stat-card-grid">
        <StatCard title="Total Revenue" value={formatCurrency(data.stats.totalRevenue)} icon={<Icons.Sale />} color="from-blue-500 to-blue-600" trend="↑ 12.5% from last month" />
        <StatCard title="Orders Today" value={String(data.stats.ordersToday)} icon={<Icons.Orders />} color="from-emerald-500 to-emerald-600" trend="↑ 8 more than yesterday" />
        <StatCard title="Low Stock Items" value={String(data.stats.lowStock)} icon={<Icons.Inventory />} color="from-amber-500 to-amber-600" />
        <StatCard title="Active Coupons" value={String(data.stats.activeCoupons)} icon={<Icons.Coupon />} color="from-purple-500 to-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <div className="content-card-wrapper">
          <h3 className="section-heading revenue-chart-heading">Monthly Revenue</h3>
          <BarChart data={data.monthlyRevenue} />
        </div>
        <div className="content-card-wrapper">
          <h3 className="section-heading" style={{ marginBottom: '16px' }}>Category-wise Inventory</h3>
          <DonutChart data={data.categoryData} />
        </div>
      </div>

      <div className="content-card-wrapper">
        <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
          <h3 className="section-heading">Recent Orders</h3>
          <button onClick={() => navigateTo('orders')} className="hover:underline" style={{ fontSize: '13px', color: 'var(--text-accent)', background: 'none', border: 'none', padding: 0 }}>View All →</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((o, i) => (
                <tr key={i}>
                  <td>
                    <button onClick={() => navigateTo('orders')} className="order-id-link" style={{ background: 'none', border: 'none', padding: 0 }}>
                      {o.id}
                    </button>
                  </td>
                  <td>{o.customer}</td>
                  <td>{o.items}</td>
                  <td style={{ fontWeight: 500 }}>{formatCurrency(o.total)}</td>
                  <td>
                    <span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span>
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
