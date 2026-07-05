import { ONLINE_SALES, OFFLINE_SALES, SETTLEMENTS } from '../../data/constants';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

const PartnerDashboard = ({ navigateTo }) => {
  const totalOnline = ONLINE_SALES.reduce((s, o) => s + o.revenue, 0);
  const totalOffline = OFFLINE_SALES.reduce((s, o) => s + o.total, 0);
  const pendingSettlements = SETTLEMENTS.filter(s => s.status === 'Pending').reduce((sum, s) => sum + s.net, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-[13px] text-slate-400 mt-1.5 font-medium">Sharma Textiles Pvt. Ltd. — Partner Overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(totalOnline + totalOffline)} icon={<Icons.Sale />} color="from-amber-500 to-amber-600" />
        <StatCard title="Online Sales" value={formatCurrency(totalOnline)} icon={<Icons.Online />} color="from-blue-500 to-blue-600" />
        <StatCard title="Offline Sales" value={formatCurrency(totalOffline)} icon={<Icons.Sale />} color="from-emerald-500 to-emerald-600" />
        <StatCard title="Pending Payouts" value={formatCurrency(pendingSettlements)} icon={<Icons.Settlement />} color="from-purple-500 to-purple-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900">Recent Offline Sales</h3>
            <button onClick={() => navigateTo('offlineSales')} className="text-sm text-amber-600 hover:text-amber-700 font-medium">View All →</button>
          </div>
          <div className="space-y-3">
            {OFFLINE_SALES.slice(0, 4).map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
                <div>
                  <p className="text-sm font-medium text-slate-700">{s.customer}</p>
                  <p className="text-xs text-slate-400">{s.bill} • {s.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{formatCurrency(s.total)}</p>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900">Platform Breakdown</h3>
          </div>
          {(() => {
            const platforms = {};
            ONLINE_SALES.forEach(s => { platforms[s.platform] = (platforms[s.platform] || 0) + s.revenue; });
            const entries = Object.entries(platforms).sort((a, b) => b[1] - a[1]);
            const maxPlatform = entries[0]?.[1] || 1;
            return (
              <div className="space-y-4">
                {entries.map(([platform, revenue], i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700">{platform}</span>
                      <span className="text-slate-500">{formatCurrency(revenue)}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700" style={{ width: `${(revenue / maxPlatform) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
