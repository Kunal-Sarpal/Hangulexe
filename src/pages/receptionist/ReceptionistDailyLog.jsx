import { useState, useEffect } from 'react';
import { apiGetDailyLogs } from '../../api/api';
import Breadcrumb from '../../components/ui/Breadcrumb';

const ReceptionistDailyLog = ({ navigateTo }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    apiGetDailyLogs().then(setLogs).catch(console.error);
  }, []);

  const getLogColor = (type) => {
    switch (type) {
      case 'system': return 'bg-slate-500';
      case 'staff': return 'bg-blue-500';
      case 'walkin': return 'bg-emerald-500';
      case 'appointment': return 'bg-purple-500';
      case 'return': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Daily Log</h2>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-slate-200" />
          <div className="space-y-4">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 relative animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`w-[9px] h-[9px] rounded-full ${getLogColor(log.type)} mt-1.5 relative z-10 ring-4 ring-white`} />
                <div className="flex-1 pb-1">
                  <span className="text-xs font-semibold text-slate-400">{log.time}</span>
                  <p className="text-sm text-slate-700 mt-0.5">{log.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDailyLog;
