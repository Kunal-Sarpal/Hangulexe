import { useState, useEffect } from 'react';
import { apiGetReceptionistDashboard } from '../../api/api';
import Icons from '../../components/Icons';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

const ReceptionistDashboard = ({ navigateTo }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiGetReceptionistDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="animate-fade-in p-8 text-center text-slate-400">Loading dashboard…</div>;

  return (
    <div className="space-y-7 animate-fade-in">
      <div>
        <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-[14px] text-slate-400 mt-1.5 font-medium">Today's reception overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Walk-ins Today" value={String(data.stats.walkinsToday)} icon={<Icons.Walkin />} color="from-emerald-500 to-emerald-600" />
        <StatCard title="Pending Fittings" value={String(data.stats.pendingFittings)} icon={<Icons.Calendar />} color="from-blue-500 to-blue-600" />
        <StatCard title="Returns Pending" value={String(data.stats.pendingReturns)} icon={<Icons.Return />} color="from-amber-500 to-amber-600" />
        <StatCard title="Feedback Collected" value={String(data.stats.feedbackCollected)} icon={<Icons.Feedback />} color="from-purple-500 to-purple-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-bold text-slate-900">Today's Appointments</h3>
            <button onClick={() => navigateTo('appointments')} className="text-[13px] text-emerald-600 hover:text-emerald-700 font-semibold hover:underline underline-offset-2 transition-colors">View All →</button>
          </div>
          <div className="space-y-2.5">
            {data.appointments.map((a, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors border border-transparent hover:border-slate-200/50">
                <div className="text-[13px] font-bold text-slate-800 w-[72px] shrink-0">{a.time}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-700 truncate">{a.customer}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{a.service}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-bold text-slate-900">Recent Walk-ins</h3>
            <button onClick={() => navigateTo('walkins')} className="text-[13px] text-emerald-600 hover:text-emerald-700 font-semibold hover:underline underline-offset-2 transition-colors">View All →</button>
          </div>
          <div className="space-y-2.5">
            {data.walkins.map((w, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors border border-transparent hover:border-slate-200/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[11px] font-bold" style={{ boxShadow: '0 4px 12px -3px rgba(34,197,94,0.35)' }}>
                  {w.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-700 truncate">{w.customer}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{w.purpose} • {w.timeIn}</p>
                </div>
                <StatusBadge status={w.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
