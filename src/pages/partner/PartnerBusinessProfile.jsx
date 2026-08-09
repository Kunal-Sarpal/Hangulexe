import { useState, useEffect } from 'react';
import { apiGetBusinessProfile } from '../../api/api';
import Icons from '../../components/Icons';
import StatusBadge from '../../components/ui/StatusBadge';
import Breadcrumb from '../../components/ui/Breadcrumb';

const PartnerBusinessProfile = ({ navigateTo, showToast }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiGetBusinessProfile().then(setProfile).catch(console.error);
  }, []);

  if (!profile) return <div className="animate-fade-in p-8 text-center text-slate-400">Loading profile…</div>;

  const fields = [
    ['Business Area / Zone', profile.zone],
    ['TP Area', profile.tp_area],
    ['GSTIN', profile.gstin],
    ['PAN', profile.pan],
    ['Business Type', profile.business_type],
    ['Contact', profile.contact],
    ['Account Manager', profile.account_manager],
    ['Partner Since', profile.partner_since],
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Business Profile</h2>
      <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden max-w-3xl">
        <div className="h-3 bg-gradient-to-r from-amber-400 to-amber-600" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl font-bold shadow-xl">ST</div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{profile.company_name}</h3>
                <p className="text-sm text-slate-500">{profile.business_type}</p>
              </div>
            </div>
            <StatusBadge status={profile.status} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {fields.map(([label, value], i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3.5">
                <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  {value}
                  {label === 'GSTIN' && (
                    <button onClick={() => { navigator.clipboard.writeText(value); showToast('GSTIN copied!'); }} className="text-slate-400 hover:text-slate-600 transition-colors"><Icons.Copy /></button>
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-slate-50 rounded-xl p-3.5">
            <p className="text-xs text-slate-400 mb-0.5">Registered Address</p>
            <p className="text-sm font-medium text-slate-800">{profile.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerBusinessProfile;
