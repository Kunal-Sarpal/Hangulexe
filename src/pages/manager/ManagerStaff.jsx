import { useState, useEffect } from 'react';
import { apiGetStaff } from '../../api/api';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icons from '../../components/Icons';
import { AdminCard, AdminStatCard } from '../../components/ui/AdminCard';

const ManagerStaff = ({ navigateTo }) => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    apiGetStaff().then(setStaff).catch(console.error);
  }, []);

  const presentCount = staff.filter(s => s.status === 'Present').length;
  const onShiftCount = staff.filter(s => s.shift && s.shift !== 'Off').length;

  return (
    <div className="space-y-6 animate-fade-in text-left">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/90 pb-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">Staff & Team Directory</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Manage store receptionists, cashiers, and department staff</p>
        </div>
        <button
          onClick={() => alert('New Staff Invite Modal')}
          className="cursor-pointer group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black bg-opacity-90 text-[#f1f1f1] rounded-full hover:bg-opacity-75 transition-all font-semibold shadow-md active:scale-95 text-xs self-start sm:self-auto"
        >
          <Icons.Plus className="w-4 h-4 text-white shrink-0" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Top Metric Strip using AdminStatCard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Staff"
          value={staff.length}
          subtext="Active boutique accounts"
        />
        <AdminStatCard
          label="Present Today"
          value={presentCount}
          subtext="Checked in today"
        />
        <AdminStatCard
          label="Active Shifts"
          value={onShiftCount}
          subtext="Currently on floor duty"
        />
        <AdminStatCard
          label="Store Location"
          value="Karol Bagh"
          subtext="Flagship showroom"
        />
      </div>

      {/* Staff Cards using user's reusable card style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((s, i) => (
          <div
            key={i}
            className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none relative px-4 pt-4 pb-3 md:px-5 md:pt-4.5 md:pb-3.5 transition-all duration-300 flex flex-col gap-2.5 cursor-pointer hover:border-zinc-400 group"
          >
            {/* Top Bar of card */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <span className="text-[11px] font-mono font-bold text-zinc-400">{s.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.status === 'Present'
                  ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                  : 'bg-zinc-50 text-zinc-400 border border-zinc-100'
                }`}>
                ● {s.status}
              </span>
            </div>

            {/* Body */}
            <div className="flex items-start gap-4 pt-1">
              <div className="w-12 h-12 rounded-full bg-zinc-900 text-white font-black text-sm flex items-center justify-center shrink-0 border border-zinc-700 shadow-xs">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-zinc-900 truncate">{s.name}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Floor Executive</p>

                <div className="mt-3 space-y-1.5 text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">📞</span>
                    <span className="font-medium text-zinc-800">{s.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-zinc-400">✉️</span>
                    <span className="truncate text-zinc-600">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                    <span className="text-[11px] font-semibold text-zinc-400">Shift:</span>
                    <span className="text-[11px] font-bold text-zinc-800">{s.shift}</span>
                    <span className="text-[11px] text-zinc-300">|</span>
                    <span className="text-[11px] text-zinc-500">In: {s.checkIn}</span>
                  </div>
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
