import { useMemo } from 'react';
import { INVENTORY, MONTHLY_REVENUE } from '../../data/constants';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatCard from '../../components/ui/StatCard';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';

const ManagerDashboard = ({ navigateTo }) => {
  const categoryData = useMemo(() => {
    const cats = {};
    INVENTORY.forEach(item => { cats[item.category] = (cats[item.category] || 0) + item.stock; });
    return Object.entries(cats).map(([label, value]) => ({ label, value }));
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="dashboard-title">Dashboard</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Welcome back — here's your store overview</p>
      </div>
      
      <div className="stat-card-grid">
        <StatCard title="Total Revenue" value="₹8,42,500" icon={<Icons.Sale />} color="from-blue-500 to-blue-600" trend="↑ 12.5% from last month" />
        <StatCard title="Orders Today" value="47" icon={<Icons.Orders />} color="from-emerald-500 to-emerald-600" trend="↑ 8 more than yesterday" />
        <StatCard title="Low Stock Items" value="12" icon={<Icons.Inventory />} color="from-amber-500 to-amber-600" />
        <StatCard title="Active Coupons" value="6" icon={<Icons.Coupon />} color="from-purple-500 to-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <div className="content-card-wrapper">
          <h3 className="section-heading revenue-chart-heading">Monthly Revenue</h3>
          <BarChart data={MONTHLY_REVENUE} />
        </div>
        <div className="content-card-wrapper">
          <h3 className="section-heading" style={{ marginBottom: '16px' }}>Category-wise Inventory</h3>
          <DonutChart data={categoryData} />
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
              {[
                { id: 'FC-2024-0892', customer: 'Ananya Mehta', items: 3, total: 4297, status: 'Delivered' },
                { id: 'FC-2024-0891', customer: 'Vikash Patel', items: 1, total: 2499, status: 'Shipped' },
                { id: 'FC-2024-0890', customer: 'Ritu Sharma', items: 2, total: 6998, status: 'Processing' },
                { id: 'FC-2024-0889', customer: 'Deepak Nair', items: 4, total: 8795, status: 'Delivered' },
                { id: 'FC-2024-0888', customer: 'Simran Kaur', items: 1, total: 999, status: 'Pending' },
              ].map((o, i) => (
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
