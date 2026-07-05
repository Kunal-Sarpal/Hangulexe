import { useState } from 'react';
import { INVENTORY, SHELF_LAYOUT } from '../../data/constants';
import { formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';

const ManagerLayout = ({ navigateTo }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const getProductForShelf = (shelfId) => INVENTORY.find(i => i.shelf === shelfId);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div>
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Inventory Layout</h2>
        <p className="text-[13px] text-slate-400 mt-1 font-medium">Visual floor/shelf layout — click a slot to view details</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
        <div className="grid gap-4">
          {SHELF_LAYOUT.map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-4">
              {row.map((slot) => {
                const product = getProductForShelf(slot);
                const isEmpty = !product;
                const statusColor = isEmpty ? 'border-dashed border-slate-200 bg-slate-50/50' :
                  product.stock === 0 ? 'border-red-200 bg-red-50/50' :
                  product.stock < 25 ? 'border-amber-200 bg-amber-50/50' :
                  'border-emerald-200 bg-emerald-50/50';
                return (
                  <button key={slot} onClick={() => setSelectedSlot(slot)} className={`p-4 rounded-xl border-2 ${statusColor} card-shadow hover:card-shadow-lg transition-all text-left group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-slate-800">{slot}</span>
                      {!isEmpty && <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-600' : product.stock < 25 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {product.stock} pcs
                      </span>}
                    </div>
                    {product ? (
                      <>
                        <p className="text-xs font-medium text-slate-700 truncate">{product.sku}</p>
                        <p className="text-[11px] text-slate-500 truncate">{product.name}</p>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Empty slot</p>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 rounded border-2 border-emerald-300 bg-emerald-50" /> In Stock</div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 rounded border-2 border-amber-300 bg-amber-50" /> Low Stock</div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 rounded border-2 border-red-300 bg-red-50" /> Out of Stock</div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 rounded border-2 border-dashed border-slate-300 bg-slate-50" /> Empty</div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedSlot} onClose={() => setSelectedSlot(null)} title={`Shelf ${selectedSlot}`}>
        {selectedSlot && (() => {
          const product = getProductForShelf(selectedSlot);
          if (!product) return <EmptyState title="Empty Shelf" subtitle="No product assigned to this location" />;
          return (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">SKU</span><p className="font-mono font-medium text-blue-600">{product.sku}</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Product</span><p className="font-medium">{product.name}</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Category</span><p>{product.category}</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Stock</span><p className="font-semibold">{product.stock} units</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Selling Price</span><p className="font-semibold">{formatCurrency(product.sellingPrice)}</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Status</span><div className="mt-1"><StatusBadge status={product.status} /></div></div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default ManagerLayout;
