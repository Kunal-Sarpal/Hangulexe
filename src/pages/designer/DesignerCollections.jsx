import { useState, useEffect } from 'react';
import { apiGetCollections } from '../../api/api';
import StatusBadge from '../../components/ui/StatusBadge';
import Breadcrumb from '../../components/ui/Breadcrumb';

const DesignerCollections = ({ navigateTo }) => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    apiGetCollections().then(setCollections).catch(console.error);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Design Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {collections.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden card-shadow hover:card-shadow-lg transition-all duration-300 animate-fade-in cursor-pointer group" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="h-3" style={{ background: c.color }} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900">{c.name}</h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-xs text-slate-500">Season: {c.season}</p>
              <p className="text-sm font-medium text-slate-700 mt-3">{c.designs} designs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignerCollections;
