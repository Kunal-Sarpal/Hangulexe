import { FormField, inputCls, btnPrimary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';

const ManagerSettings = ({ navigateTo, showToast }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Settings</h2>
    <div className="max-w-2xl space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 space-y-4">
        <h3 className="font-bold text-slate-900">Store Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Store Name"><input className={inputCls} defaultValue="Fashion Co — Karol Bagh" /></FormField>
          <FormField label="Phone"><input className={inputCls} defaultValue="+91 11 2872 3456" /></FormField>
          <FormField label="Email"><input className={inputCls} defaultValue="info@fashionco.com" /></FormField>
          <FormField label="GSTIN"><input className={inputCls} defaultValue="07AAHCS1234A1Z5" /></FormField>
        </div>
        <FormField label="Address"><textarea className={inputCls + ' resize-none'} rows={2} defaultValue="45, Cloth Market, Karol Bagh, New Delhi — 110005" /></FormField>
        <div className="flex justify-end pt-2">
          <button onClick={() => showToast('Settings saved')} className={btnPrimary}>Save Changes</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 space-y-4">
        <h3 className="font-bold text-slate-900">Notifications</h3>
        {['Low stock alerts', 'New order notifications', 'Daily sales summary', 'Staff check-in alerts'].map((item, i) => (
          <label key={i} className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">{item}</span>
            <div className="relative">
              <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 peer-checked:bg-blue-500 rounded-full transition-colors cursor-pointer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-all peer-checked:after:translate-x-5" />
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default ManagerSettings;
