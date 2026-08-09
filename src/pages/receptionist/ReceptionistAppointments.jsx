import { useState, useEffect } from 'react';
import { apiGetAppointments } from '../../api/api';
import StatusBadge from '../../components/ui/StatusBadge';
import Breadcrumb from '../../components/ui/Breadcrumb';

const ReceptionistAppointments = ({ navigateTo }) => {
  const [appointments, setAppointments] = useState([]);
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    apiGetAppointments().then(setAppointments).catch(console.error);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div>
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Appointments & Fittings</h2>
        <p className="text-[13px] text-slate-400 mt-1 font-medium">{dateStr}</p>
      </div>
      <div className="space-y-3">
        {appointments.map((a, i) => {
          const statusColors = a.status === 'Confirmed' ? 'border-l-emerald-500 bg-emerald-50/30' : a.status === 'Pending' ? 'border-l-amber-500 bg-amber-50/30' : 'border-l-red-500 bg-red-50/30';
          return (
            <div key={i} className={`bg-white rounded-xl border border-slate-200/50 border-l-4 ${statusColors} p-5 card-shadow hover:card-shadow-lg transition-all animate-fade-in`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-slate-800 w-24">{a.time}</div>
                  <div>
                    <p className="font-bold text-slate-900">{a.customer}</p>
                    <p className="text-sm text-slate-500">{a.service}</p>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReceptionistAppointments;
