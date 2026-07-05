import { useState, useMemo } from 'react';
import { INVENTORY } from '../../data/constants';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import { FormField, inputCls, btnPrimary, btnSecondary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';

const ManagerInventory = ({ navigateTo, showToast }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDesigner, setFilterDesigner] = useState('All');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const perPage = 6;

  const categories = useMemo(() => ['All', ...new Set(INVENTORY.map(i => i.category))], []);
  const designers = useMemo(() => ['All', ...new Set(INVENTORY.map(i => i.designer))], []);
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  const filtered = useMemo(() => {
    return INVENTORY.filter(item => {
      const matchSearch = !search || item.sku.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'All' || item.category === filterCategory;
      const matchStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchDesigner = filterDesigner === 'All' || item.designer === filterDesigner;
      return matchSearch && matchCat && matchStatus && matchDesigner;
    });
  }, [search, filterCategory, filterStatus, filterDesigner]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="mx-auto max-w-[1400px] w-full px-8 py-6 flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
        <div className="flex flex-col gap-2">
          <h2 className="text-[32px] font-bold text-[#111827] tracking-tight leading-none">Inventory</h2>
          <p className="text-[14px] text-[#6B7280] font-medium leading-none">{INVENTORY.length} products in catalog</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 flex flex-wrap items-center gap-4">
          {/* Search Input Container */}
          <div className="relative w-full lg:w-[45%] min-w-[280px] h-11">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" style={{ display: 'inline-flex', alignItems: 'center' }}><Icons.Search /></span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by SKU or product name…" className="w-full h-full rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] text-[#111827] font-medium placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] hover:border-[#D1D5DB] transition-all duration-200" style={{ paddingLeft: '40px', paddingRight: '16px' }} />
          </div>
          {/* Dropdown Filters */}
          <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }} className="h-11 rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] hover:border-[#D1D5DB] transition-all duration-200 cursor-pointer" style={{ paddingLeft: '16px', paddingRight: '36px', minWidth: '140px' }}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="h-11 rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] hover:border-[#D1D5DB] transition-all duration-200 cursor-pointer" style={{ paddingLeft: '16px', paddingRight: '36px', minWidth: '130px' }}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterDesigner} onChange={e => { setFilterDesigner(e.target.value); setPage(1); }} className="h-11 rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] hover:border-[#D1D5DB] transition-all duration-200 cursor-pointer" style={{ paddingLeft: '16px', paddingRight: '36px', minWidth: '140px' }}>
            {designers.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        
        {/* Add Product Button */}
        <button onClick={() => setShowAddModal(true)} className="h-11 rounded-[10px] bg-[#2563EB] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-sm shadow-[#2563EB]/15 hover:shadow-md hover:shadow-[#2563EB]/20 cursor-pointer" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <Icons.Plus /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        {paged.length === 0 ? <EmptyState title="No products found" subtitle="Try adjusting your filters" /> : (
          <>
            <TableWrapper>
              <thead><tr>
                <Th className="text-left">SKU</Th>
                <Th className="text-left">Product Name</Th>
                <Th className="text-left">Category</Th>
                <Th className="text-left">Designer</Th>
                <Th className="text-left">Vendor</Th>
                <Th className="text-right">MRP</Th>
                <Th className="text-right">Selling ₹</Th>
                <Th className="text-center">Stock</Th>
                <Th className="text-right">Sold</Th>
                <Th className="text-left">Status</Th>
              </tr></thead>
              <tbody>
                {paged.map((item, i) => (
                  <tr key={i} className="hover:bg-[#F9FAFB] transition-colors border-b border-[#F3F4F6] last:border-b-0">
                    <Td className="text-left"><span className="font-mono text-xs font-semibold text-[#2563EB]">{item.sku}</span></Td>
                    <Td className="text-left"><span className="font-medium text-[#111827]">{item.name}</span></Td>
                    <Td className="text-left text-[#6B7280]">{item.category}</Td>
                    <Td className="text-left text-[#6B7280]">{item.designer}</Td>
                    <Td className="text-left text-xs text-[#6B7280]">{item.vendor}</Td>
                    <Td className="text-right font-mono text-[#6B7280] tabular-nums">{formatCurrency(item.mrp)}</Td>
                    <Td className="text-right font-semibold font-mono text-[#111827] tabular-nums">{formatCurrency(item.sellingPrice)}</Td>
                    <Td className="text-center font-bold">
                      <span className={item.stock === 0 ? 'text-[#EF4444]' : item.stock < 25 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}>
                        {item.stock}
                      </span>
                    </Td>
                    <Td className="text-right font-mono text-[#111827] tabular-nums">{item.sold}</Td>
                    <Td className="text-left"><StatusBadge status={item.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product" width="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Product Name"><input className={inputCls} placeholder="e.g. Silk Kurta" /></FormField>
          <FormField label="SKU ID"><input className={inputCls} placeholder="SKU-XXX" /></FormField>
          <FormField label="Category">
            <select className={inputCls}>
              <option>Ethnic Wear</option><option>Casuals</option><option>Western</option><option>Formals</option><option>Fusion</option><option>Casualwear</option>
            </select>
          </FormField>
          <FormField label="Model"><input className={inputCls} placeholder="Model code" /></FormField>
          <FormField label="Designer"><input className={inputCls} placeholder="Designer name" /></FormField>
          <FormField label="Supplier/Vendor"><input className={inputCls} placeholder="Vendor name" /></FormField>
          <FormField label="MRP (₹)"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Cost Price (₹)"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Purchase Price (₹)"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Selling Price (₹)"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Stock Quantity"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Shelf Location"><input className={inputCls} placeholder="e.g. A1" /></FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowAddModal(false)} className={btnSecondary}>Cancel</button>
          <button onClick={() => { setShowAddModal(false); showToast('Product added successfully'); }} className={btnPrimary}>Add Product</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerInventory;
