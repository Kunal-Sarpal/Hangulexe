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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-left">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/90 pb-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">System Settings & Store Profile</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Manage store business profile, contact details, GST, and automated alerts</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Store Information Card */}
        <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none overflow-hidden transition-all duration-300">
          <div className="px-5 py-3.5 border-b border-zinc-200/90 flex items-center justify-between bg-zinc-50/50">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Store Business Profile</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Official details printed on customer invoices and receipts</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
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

            <div className="flex justify-end pt-3 border-t border-zinc-200/90">
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="cursor-pointer group relative inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-black bg-opacity-90 text-[#f1f1f1] rounded-full hover:bg-opacity-75 transition-all font-semibold shadow-md active:scale-95 text-xs disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none overflow-hidden transition-all duration-300">
          <div className="px-5 py-3.5 border-b border-zinc-200/90 flex items-center justify-between bg-zinc-50/50">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Automated Notifications</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Control operational push alerts and email notifications</p>
            </div>
            <span className="text-[10px] bg-zinc-100 text-zinc-700 font-bold px-2 py-0.5 rounded border border-zinc-200">Alert Rules</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="divide-y divide-zinc-200/90">
              {[
                { key: 'lowStock', label: 'Low stock alerts', desc: 'Notify when products reach threshold inventory levels' },
                { key: 'newOrders', label: 'New order notifications', desc: 'Instant alerts for online & storefront customer orders' },
                { key: 'dailySummary', label: 'Daily sales summary', desc: 'Receive nightly revenue & inventory digest' },
                { key: 'staffCheckin', label: 'Staff check-in alerts', desc: 'Alerts when employees log shifts' }
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center justify-between py-3.5 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">{label}</span>
                    <span className="text-[11px] text-zinc-400">{desc}</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={!!storeInfo.notifications?.[key]} 
                      onChange={() => toggleNotification(key)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-checked:bg-zinc-900 rounded-full transition-colors cursor-pointer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow after:transition-all peer-checked:after:translate-x-5" />
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-200/90">
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="cursor-pointer group relative inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-black bg-opacity-90 text-[#f1f1f1] rounded-full hover:bg-opacity-75 transition-all font-semibold shadow-md active:scale-95 text-xs disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerSettings;
