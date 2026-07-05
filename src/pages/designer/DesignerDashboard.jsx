import { DESIGNS } from '../../data/constants';
import Icons from '../../components/Icons';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

const DesignerDashboard = ({ navigateTo }) => (
  <div className="space-y-7 animate-fade-in">
    <div>
      <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
      <p className="text-[14px] text-slate-400 mt-1.5 font-medium">Your design studio overview</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard title="Designs Published" value="24" icon={<Icons.Design />} color="from-purple-500 to-purple-600" />
      <StatCard title="Pending Review" value="3" icon={<Icons.Log />} color="from-amber-500 to-amber-600" />
      <StatCard title="Products Using Designs" value="18" icon={<Icons.Link />} color="from-blue-500 to-blue-600" />
      <StatCard title="Most Sold Design" value={<span className="text-[18px]">"Floral Maxi"</span>} icon={<Icons.Design />} color="from-pink-500 to-pink-600" trend="421 units sold" />
    </div>
    <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-slate-900">Recent Designs</h3>
        <button onClick={() => navigateTo('myDesigns')} className="text-[13px] text-purple-600 hover:text-purple-700 font-semibold hover:underline underline-offset-2 transition-colors">View All →</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {DESIGNS.slice(0, 3).map((d, i) => (
          <div key={i} className="rounded-xl border border-slate-200/50 overflow-hidden card-shadow hover:card-shadow-lg transition-all group">
            <div className="h-28 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${d.color}22, ${d.color}44)` }}>
              <span className="text-lg font-bold" style={{ color: d.color }}>{d.name}</span>
            </div>
            <div className="p-3">
              <p className="text-xs text-slate-500">{d.collection} • {d.season}</p>
              <div className="flex items-center justify-between mt-2">
                <StatusBadge status={d.status} />
                <span className="text-xs text-slate-400">{d.products} products</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DesignerDashboard;
