import { useState, useEffect } from 'react';
import { apiGetCoupons, apiCreateCoupon } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import { FormField, inputCls, btnPrimary, btnSecondary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';

const ManagerCoupons = ({ navigateTo, showToast }) => {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({});
  const perPage = 5;

  const fetchCoupons = () => apiGetCoupons().then(setCoupons).catch(console.error);
  useEffect(() => { fetchCoupons(); }, []);

  const totalPages = Math.ceil(coupons.length / perPage);
  const paged = coupons.slice((page - 1) * perPage, page * perPage);

  const handleCreate = async () => {
    try {
      await apiCreateCoupon(newCoupon);
      setShowModal(false);
      setNewCoupon({});
      showToast('Coupon created successfully');
      fetchCoupons();
    } catch (err) {
      showToast(err.message || 'Failed', 'error');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Coupons & Promotions</h2>
        <button onClick={() => setShowModal(true)} className={`${btnPrimary} flex items-center gap-2`}><Icons.Plus /> Create Coupon</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Code</Th><Th>Type</Th><Th>Value</Th><Th>Min Order</Th><Th>Valid From</Th><Th>Valid To</Th><Th>Usage</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {paged.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td><span className="font-mono font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{c.code}</span></Td>
                <Td>{c.type}</Td>
                <Td className="font-medium">{c.value}</Td>
                <Td>{formatCurrency(c.minOrder)}</Td>
                <Td className="text-xs">{c.validFrom}</Td>
                <Td className="text-xs">{c.validTo}</Td>
                <Td>{c.usage}</Td>
                <Td><StatusBadge status={c.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Coupon">
        <div className="space-y-4">
          <FormField label="Coupon Code"><input className={inputCls} placeholder="e.g. SUMMER30" onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value }))} /></FormField>
          <FormField label="Discount Type">
            <select className={inputCls} onChange={e => setNewCoupon(p => ({ ...p, type: e.target.value }))}><option>% Off</option><option>Flat Off</option><option>BOGO</option></select>
          </FormField>
          <FormField label="Value"><input className={inputCls} placeholder="e.g. 20% or ₹100" onChange={e => setNewCoupon(p => ({ ...p, value: e.target.value }))} /></FormField>
          <FormField label="Minimum Order (₹)"><input type="number" className={inputCls} placeholder="0" onChange={e => setNewCoupon(p => ({ ...p, minOrder: e.target.value }))} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Valid From"><input type="date" className={inputCls} onChange={e => setNewCoupon(p => ({ ...p, validFrom: e.target.value }))} /></FormField>
            <FormField label="Valid To"><input type="date" className={inputCls} onChange={e => setNewCoupon(p => ({ ...p, validTo: e.target.value }))} /></FormField>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className={btnSecondary}>Cancel</button>
          <button onClick={handleCreate} className={btnPrimary}>Create Coupon</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerCoupons;
