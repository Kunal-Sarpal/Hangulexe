import { useState, useEffect } from 'react';
import { apiGetProducts, apiGetShelfLayout } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';

const DEFAULT_SHELF_LAYOUT = [
  ['A1-101', 'A1-102', 'A3-304', 'A1-209'],
  ['A2-201', 'A2-202', 'A2-203', 'A2-204'],
  ['B1-105', 'B1-106', 'B1-107', 'B1-108'],
  ['C2-101', 'C2-102', 'C2-103', 'C2-104']
];

const ManagerLayout = ({ navigateTo }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [shelfLayout, setShelfLayout] = useState(DEFAULT_SHELF_LAYOUT);

  useEffect(() => {
    apiGetProducts({ limit: 100 }).then(data => {
      if (data && data.products) setInventory(data.products);
    }).catch(console.error);

    apiGetShelfLayout().then(layout => {
      if (Array.isArray(layout) && layout.length > 0) {
        setShelfLayout(layout);
      }
    }).catch(console.error);
  }, []);

  const getProductForShelf = (shelfId, index = 0) => {
    if (!inventory || inventory.length === 0) return null;
    // 1. Direct match by shelf ID
    let found = inventory.find(i => i.shelf === shelfId || (i.shelf && shelfId.startsWith(i.shelf)));
    if (!found) {
      // 2. Fallback index mapping
      const flatSlots = shelfLayout.flat();
      const slotIndex = flatSlots.indexOf(shelfId);
      if (slotIndex >= 0 && slotIndex < inventory.length) {
        found = inventory[slotIndex];
      }
    }
    return found;
  };

  const activeLayout = (shelfLayout && shelfLayout.length > 0) ? shelfLayout : DEFAULT_SHELF_LAYOUT;

  return (
    <div className="space-y-6 animate-fade-in mx-auto max-w-[1400px] w-full px-8 py-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
        <div>
          <h2 className="text-[32px] font-bold text-[#111827] tracking-tight leading-none">Inventory Layout</h2>
          <p className="text-[14px] text-[#6B7280] font-medium leading-none mt-1">Visual floor/shelf layout — click a slot to view details</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
        <div className="grid gap-5">
          {activeLayout.map((row, ri) => (
            <div key={ri} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {row.map((slot, ci) => {
                const product = getProductForShelf(slot, ri * 4 + ci);
                const isEmpty = !product;
                const statusColor = isEmpty 
                  ? 'border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50' 
                  : product.stock === 0 
                  ? 'border-red-200 bg-red-50/30 hover:border-red-400' 
                  : product.stock < 25 
                  ? 'border-amber-200 bg-amber-50/30 hover:border-amber-400' 
                  : 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-400';

                const imageUrl = product?.image_url || (product?.images && product.images[0]) || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80';

                return (
                  <button 
                    key={slot} 
                    onClick={() => setSelectedSlot({ slot, product })} 
                    className={`p-4 rounded-xl border-2 ${statusColor} transition-all duration-200 text-left group cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between min-h-[140px]`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black font-mono text-slate-800 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                          {slot}
                        </span>
                        {!isEmpty ? (
                          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                            product.stock === 0 ? 'bg-red-100 text-red-700' : product.stock < 25 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {product.stock} pcs
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Empty</span>
                        )}
                      </div>

                      {product ? (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-inner">
                            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-xs font-semibold text-blue-600 block">{product.sku}</span>
                            <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{formatCurrency(product.sellingPrice)}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic mt-3">Unassigned Shelf</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <div className="w-3.5 h-3.5 rounded border-2 border-emerald-400 bg-emerald-100" /> In Stock
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <div className="w-3.5 h-3.5 rounded border-2 border-amber-400 bg-amber-100" /> Low Stock
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <div className="w-3.5 h-3.5 rounded border-2 border-red-400 bg-red-100" /> Out of Stock
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <div className="w-3.5 h-3.5 rounded border-2 border-dashed border-slate-300 bg-slate-100" /> Empty
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedSlot} onClose={() => setSelectedSlot(null)} title={`Shelf Location: ${selectedSlot?.slot || ''}`} width="max-w-md">
        {selectedSlot && (() => {
          const product = selectedSlot.product;
          if (!product) return <EmptyState title="Empty Shelf" subtitle="No product assigned to this location yet" />;
          const imageUrl = product.image_url || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80';
          
          return (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <img src={imageUrl} alt={product.name} className="w-16 h-20 object-cover rounded-lg border border-slate-200 bg-white" />
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600">{product.sku}</span>
                  <h4 className="font-bold text-slate-900 text-base">{product.name}</h4>
                  <p className="text-xs text-slate-500">{product.category} • {product.gender || 'Women'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="text-slate-400 text-xs block font-medium">Designer / Brand</span>
                  <p className="font-semibold text-slate-800">{product.designer || 'FashionCo'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="text-slate-400 text-xs block font-medium">Stock Status</span>
                  <div className="mt-1"><StatusBadge status={product.status} /></div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="text-slate-400 text-xs block font-medium">Available Units</span>
                  <p className="font-mono font-bold text-slate-900 text-base">{product.stock} pcs</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="text-slate-400 text-xs block font-medium">Selling Price</span>
                  <p className="font-mono font-bold text-slate-900 text-base">{formatCurrency(product.sellingPrice)}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default ManagerLayout;
