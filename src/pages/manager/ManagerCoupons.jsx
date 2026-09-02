import { useState, useEffect } from 'react';
import { apiGetCoupons, apiCreateCoupon } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { FormField, inputCls, btnPrimary, btnSecondary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';
import { AdminCard, AdminStatCard } from '../../components/ui/AdminCard';

const ManagerCoupons = ({ navigateTo, showToast }) => {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({});
  const perPage = 5;

  const fetchCoupons = () => {
    apiGetCoupons()
      .then(res => {
        if (Array.isArray(res)) {
          setCoupons(res);
        } else if (res && Array.isArray(res.coupons)) {
          setCoupons(res.coupons);
        } else {
          setCoupons([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch coupons:', err);
        setCoupons([]);
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const totalPages = Math.max(1, Math.ceil((coupons?.length || 0) / perPage));
  const paged = Array.isArray(coupons) ? coupons.slice((page - 1) * perPage, page * perPage) : [];

  const handleCreate = async () => {
    try {
      await apiCreateCoupon(newCoupon);
      setShowModal(false);
      setNewCoupon({});
      if (showToast) showToast('Coupon created successfully');
      fetchCoupons();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to create coupon', 'error');
    }
  };

  const activeCouponsCount = Array.isArray(coupons) ? coupons.filter(c => c.status === 'Active').length : 0;

  return (
    <div className="space-y-6 animate-fade-in text-left">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/90 pb-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">Coupons & Promotions</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Manage promo discount codes, minimum spends, and expiration dates</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black bg-opacity-90 text-[#f1f1f1] rounded-full hover:bg-opacity-75 transition-all font-semibold shadow-md active:scale-95 text-xs self-start sm:self-auto"
        >
          <Icons.Plus className="w-4 h-4 text-white shrink-0" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Top Metric Strip using AdminStatCard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Coupons"
          value={coupons.length}
          subtext="Configured promotion rules"
        />
        <AdminStatCard
          label="Active Live"
          value={activeCouponsCount}
          subtext="Redeemable in checkout"
        />
        <AdminStatCard
          label="Max Discount"
          value="50% Off"
          subtext="Storewide seasonal cap"
        />
        <AdminStatCard
          label="Store Channel"
          value="Omnichannel"
          subtext="Online & flagship boutique"
        />
      </div>

      {/* Coupons Table Card */}
      <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none overflow-hidden transition-all duration-300">
        <div className="px-5 py-3.5 border-b border-zinc-200/90 flex items-center justify-between bg-zinc-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Active Coupon Directory
          </h3>
          <span className="text-xs text-zinc-400">{coupons.length} promotion rules</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200/90 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-5">Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Valid Period</th>
                <th className="py-3 px-4 text-center">Usage</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/90 text-xs font-medium text-zinc-800">
              {paged.map((c, i) => (
                <tr key={i} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-5">
                    <span className="font-machina font-bold text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-500">{c.type}</td>
                  <td className="py-3 px-4 font-bold text-zinc-900 font-machina">{c.value}</td>
                  <td className="py-3 px-4 font-machina font-bold">{formatCurrency(c.minOrder)}</td>
                  <td className="py-3 px-4 text-[11px] text-zinc-500 font-machina">
                    {c.validFrom} to {c.validTo}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-zinc-800 font-machina">
                    {c.usage}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <div className="flex items-center justify-center">
                      <StatusBadge status={c.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 px-5 border-t border-zinc-200/90 flex items-center justify-between text-xs text-zinc-500">
          <span>Showing Page {page} of {totalPages}</span>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Create New Coupon"
        subtitle="Configure discount rules, minimum cart spends, and expiration dates."
        width="max-w-lg"
      >
        <div className="space-y-4">
          <FormField label="Coupon Code">
            <input className={inputCls} placeholder="e.g. SUMMER30" onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value }))} />
          </FormField>
          <FormField label="Discount Type">
            <select className={inputCls} onChange={e => setNewCoupon(p => ({ ...p, type: e.target.value }))}>
              <option>% Off</option>
              <option>Flat Off</option>
              <option>BOGO</option>
            </select>
          </FormField>
          <FormField label="Value">
            <input className={inputCls} placeholder="e.g. 20% or ₹100" onChange={e => setNewCoupon(p => ({ ...p, value: e.target.value }))} />
          </FormField>
          <FormField label="Minimum Order (₹)">
            <input type="number" className={inputCls} placeholder="0" onChange={e => setNewCoupon(p => ({ ...p, minOrder: e.target.value }))} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Valid From">
              <input type="date" className={inputCls} onChange={e => setNewCoupon(p => ({ ...p, validFrom: e.target.value }))} />
            </FormField>
            <FormField label="Valid To">
              <input type="date" className={inputCls} onChange={e => setNewCoupon(p => ({ ...p, validTo: e.target.value }))} />
            </FormField>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className={btnSecondary}>Cancel</button>
          <button onClick={handleCreate} className="cursor-pointer group relative inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-black bg-opacity-90 text-[#f1f1f1] rounded-full hover:bg-opacity-75 transition-all font-semibold shadow-md active:scale-95 text-xs">
            Create Coupon
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerCoupons;
