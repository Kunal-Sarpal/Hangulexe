import { useState } from 'react';
import { OFFLINE_SALES } from '../../data/constants';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import { FormField, inputCls, btnPrimary, btnSecondary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';

const PartnerOfflineSales = ({ navigateTo, showToast }) => {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const perPage = 5;
  const totalPages = Math.ceil(OFFLINE_SALES.length / perPage);
  const paged = OFFLINE_SALES.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Offline Sales</h2>
        <button onClick={() => setShowModal(true)} className={`${btnPrimary} flex items-center gap-2`}><Icons.Plus /> Record Sale</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Bill No</Th><Th>Date</Th><Th>Customer</Th><Th>Items</Th><Th>Total</Th><Th>Payment</Th><Th>GST</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {paged.map((s, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td><span className="font-mono text-xs font-medium text-amber-600">{s.bill}</span></Td>
                <Td className="text-xs">{s.date}</Td>
                <Td className="font-medium">{s.customer}</Td>
                <Td>{s.items}</Td>
                <Td className="font-medium">{formatCurrency(s.total)}</Td>
                <Td><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.payment === 'Cash' ? 'bg-emerald-50 text-emerald-600' : s.payment === 'Card' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{s.payment}</span></Td>
                <Td>{s.gst ? <span className="text-emerald-600 font-medium text-xs">Applied</span> : <span className="text-slate-400 text-xs">No</span>}</Td>
                <Td><StatusBadge status={s.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record New Sale" width="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Customer Name"><input className={inputCls} placeholder="Enter customer name" /></FormField>
            <FormField label="Phone"><input className={inputCls} placeholder="+91" /></FormField>
          </div>
          <FormField label="Items">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`} placeholder="Item name" />
                <input className={`${inputCls} w-20`} placeholder="Qty" type="number" />
                <input className={`${inputCls} w-28`} placeholder="Price ₹" type="number" />
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">+ Add another item</button>
            </div>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Payment Mode">
              <select className={inputCls}><option>Cash</option><option>Card</option><option>UPI</option></select>
            </FormField>
            <FormField label="Apply GST">
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600">Include GST</span>
                </label>
              </div>
            </FormField>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className={btnSecondary}>Cancel</button>
          <button onClick={() => { setShowModal(false); showToast('Sale recorded successfully'); }} className={btnPrimary}>Record Sale</button>
        </div>
      </Modal>
    </div>
  );
};

export default PartnerOfflineSales;
