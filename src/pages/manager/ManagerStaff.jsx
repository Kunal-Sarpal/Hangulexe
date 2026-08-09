import { useState, useEffect } from 'react';
import { apiGetStaff } from '../../api/api';
import StatusBadge from '../../components/ui/StatusBadge';
import Breadcrumb from '../../components/ui/Breadcrumb';

const ManagerStaff = ({ navigateTo }) => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    apiGetStaff().then(setStaff).catch(console.error);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Staff — Receptionists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {staff.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/50 p-5 card-shadow hover:card-shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.status === 'Present' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-slate-300 to-slate-400'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{s.name}</h3>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{s.id}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                  <div><span className="text-slate-400">Phone:</span> {s.phone}</div>
                  <div><span className="text-slate-400">Email:</span> {s.email}</div>
                  <div><span className="text-slate-400">Shift:</span> {s.shift}</div>
                  <div><span className="text-slate-400">Check-in:</span> {s.checkIn}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerStaff;
