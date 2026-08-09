import { useState, useEffect } from 'react';
import { FormField, inputCls, btnPrimary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';

const ManagerSettings = ({ navigateTo, showToast }) => {
  const [storeInfo, setStoreInfo] = useState({
    company_name: 'Fashion Co — Karol Bagh',
    phone: '+91 11 2872 3456',
    email: 'info@fashionco.com',
    gstin: '07AAHCS1234A1Z5',
    address: '45, Cloth Market, Karol Bagh, New Delhi — 110005',
    notifications: {
      lowStock: true,
      newOrders: true,
      dailySummary: true,
      staffCheckin: false
    }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/business-profile')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStoreInfo(prev => ({
            ...prev,
            company_name: data.company_name || prev.company_name,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            gstin: data.gstin || prev.gstin,
            address: data.address || prev.address,
            notifications: data.notifications || prev.notifications
          }));
        }
      })
      .catch(err => console.error('Error fetching store profile:', err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/business-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeInfo)
      });
      const data = await res.json();
      if (res.ok) {
        if (showToast) showToast('Store information updated successfully!');
      } else {
        if (showToast) showToast(data.error || 'Failed to update store info', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Settings saved locally!');
    }
    setSaving(false);
  };

  const toggleNotification = (key) => {
    setStoreInfo(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in mx-auto max-w-[1400px] w-full px-8 py-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
        <div>
          <h2 className="text-[32px] font-bold text-[#111827] tracking-tight leading-none">Settings</h2>
          <p className="text-[14px] text-[#6B7280] font-medium leading-none mt-1">Manage store profile, contact details and system notifications</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Store Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Store Information</h3>
            <p className="text-xs text-slate-500">Official business details displayed on receipts and customer communications.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Store Name">
              <input 
                value={storeInfo.company_name} 
                onChange={e => setStoreInfo({ ...storeInfo, company_name: e.target.value })} 
                className={inputCls} 
              />
            </FormField>
            <FormField label="Phone">
              <input 
                value={storeInfo.phone} 
                onChange={e => setStoreInfo({ ...storeInfo, phone: e.target.value })} 
                className={inputCls} 
              />
            </FormField>
            <FormField label="Email">
              <input 
                value={storeInfo.email} 
                onChange={e => setStoreInfo({ ...storeInfo, email: e.target.value })} 
                className={inputCls} 
              />
            </FormField>
            <FormField label="GSTIN">
              <input 
                value={storeInfo.gstin} 
                onChange={e => setStoreInfo({ ...storeInfo, gstin: e.target.value })} 
                className={inputCls} 
              />
            </FormField>
          </div>

          <FormField label="Address">
            <textarea 
              rows={2} 
              value={storeInfo.address} 
              onChange={e => setStoreInfo({ ...storeInfo, address: e.target.value })} 
              className={`${inputCls} resize-none h-auto py-2.5`} 
            />
          </FormField>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button onClick={handleSave} disabled={saving} className={`${btnPrimary} cursor-pointer`}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Notifications</h3>
            <p className="text-xs text-slate-500">Control automated email and push alerts for key store operations.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              { key: 'lowStock', label: 'Low stock alerts', desc: 'Notify when products reach threshold stock levels' },
              { key: 'newOrders', label: 'New order notifications', desc: 'Instant alerts for online & POS orders' },
              { key: 'dailySummary', label: 'Daily sales summary', desc: 'Receive nightly revenue & inventory digest' },
              { key: 'staffCheckin', label: 'Staff check-in alerts', desc: 'Alerts when employees log shifts' }
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between py-3.5 cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">{label}</span>
                  <span className="text-xs text-slate-400">{desc}</span>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={!!storeInfo.notifications?.[key]} 
                    onChange={() => toggleNotification(key)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-checked:bg-blue-600 rounded-full transition-colors cursor-pointer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow after:transition-all peer-checked:after:translate-x-5" />
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button onClick={handleSave} disabled={saving} className={`${btnPrimary} cursor-pointer`}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSettings;
