import { useState, useEffect } from 'react';
import { apiGetDesigns } from '../../api/api';
import Icons from '../../components/Icons';
import StatusBadge from '../../components/ui/StatusBadge';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { btnPrimary } from '../../components/ui/FormField';

const DesignerMyDesigns = ({ navigateTo }) => {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    apiGetDesigns().then(setDesigns).catch(console.error);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">My Designs</h2>
        <button onClick={() => navigateTo('uploadDesign')} className={`${btnPrimary} flex items-center gap-2`}><Icons.Plus /> New Design</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {designs.map((d, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden hover:card-shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="h-40 flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${d.color}15, ${d.color}35)` }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 20% 30%, ${d.color}40 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${d.color}30 0%, transparent 50%)` }} />
              <span className="text-2xl font-bold relative z-10" style={{ color: d.color }}>{d.name}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{d.name}</span>
                <StatusBadge status={d.status} />
              </div>
              <p className="text-xs text-slate-500">{d.collection} • {d.season}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">{d.products} products linked</span>
                <button className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  <Icons.Eye /> View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignerMyDesigns;
