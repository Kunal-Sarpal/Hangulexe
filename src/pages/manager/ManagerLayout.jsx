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
    <div className="space-y-6 animate-fade-in text-left">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/90 pb-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">Warehouse & Shelf Layout</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Visual boutique floor rack mapping — click any shelf slot to inspect inventory</p>
        </div>
        <button
          onClick={() => navigateTo('inventory')}
          className="px-3 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          ← Back to Inventory List
        </button>
      </div>

      <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none overflow-hidden transition-all duration-300">
        <div className="px-5 py-3.5 border-b border-zinc-200/90 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Karol Bagh Boutique — Shelf Grid</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">16 designated storage slots across physical racks A, B, and C</p>
          </div>
          <span className="text-[10px] bg-zinc-100 text-zinc-700 font-bold px-2.5 py-0.5 rounded border border-zinc-200 font-machina">Racks A, B, C</span>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {activeLayout.map((row, ri) => (
              <div key={ri} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {row.map((slot, ci) => {
                  const product = getProductForShelf(slot, ri * 4 + ci);
                  const isEmpty = !product;
                  const stockNum = product ? (parseInt(product.stock) || 0) : 0;
                  const isOut = !isEmpty && stockNum === 0;
                  const isLow = !isEmpty && stockNum > 0 && stockNum < 25;

                  const fallbackImg = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80';
                  const imageUrl = product?.image_url || (product?.images && product.images[0]) || fallbackImg;

                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot({ slot, product })}
                      className="bg-white border border-zinc-200/90 hover:border-zinc-400 rounded-xl p-3.5 transition-all duration-200 text-left group cursor-pointer hover:shadow-xs flex flex-col justify-between min-h-[135px]"
                    >
                      <div>
                        {/* Header: Slot code & Stock pill */}
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-black font-machina text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 tracking-wider">
                            {slot}
                          </span>
                          {!isEmpty ? (
                            isOut ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full font-machina">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                0 pcs
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full font-machina">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                {stockNum} pcs
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-machina">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {stockNum} pcs
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-zinc-400 font-semibold px-2 py-0.5 bg-zinc-50 rounded border border-zinc-100">
                              Empty Slot
                            </span>
                          )}
                        </div>

                        {/* Product details */}
                        {product ? (
                          <div className="flex items-center gap-3 mt-2">
                            <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-200/80 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                              <img 
                                src={imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-200" 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = fallbackImg;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-machina text-[11px] font-semibold text-zinc-500 block truncate">
                                {product.sku || 'SKU-N/A'}
                              </span>
                              <p className="text-xs font-bold text-zinc-900 truncate mt-0.5">
                                {product.name}
                              </p>
                              <p className="text-xs font-machina font-bold text-zinc-900 mt-0.5">
                                {formatCurrency(product.sellingPrice)}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="py-4 text-center">
                            <p className="text-xs text-zinc-400 font-medium">Unassigned Shelf</p>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Professional Minimalist Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-6 pt-5 border-t border-zinc-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> In Stock (25+ pcs)
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" /> Low Stock (&lt; 25 pcs)
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" /> Out of Stock (0 pcs)
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
              <span className="w-2 h-2 rounded-full border border-zinc-400 bg-zinc-200 shrink-0" /> Empty Slot
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedSlot} 
        onClose={() => setSelectedSlot(null)} 
        title={`Shelf Location: ${selectedSlot?.slot || ''}`} 
        subtitle="Boutique rack slot inspection and active SKU details."
        width="max-w-md"
      >
        {selectedSlot && (() => {
          const product = selectedSlot.product;
          if (!product) return <EmptyState title="Empty Shelf" subtitle="No product assigned to this location yet" />;
          const fallbackImg = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80';
          const imageUrl = product.image_url || (product.images && product.images[0]) || fallbackImg;

          return (
            <div className="flex flex-col gap-4 text-left">
              <div className="flex gap-3.5 items-center bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
                <div className="w-16 h-16 rounded-lg bg-white border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                  <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-md" 
                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-machina text-xs font-bold text-zinc-500">{product.sku}</span>
                  <h4 className="font-bold text-zinc-900 text-sm truncate mt-0.5">{product.name}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">{product.category} • {product.gender || 'Women'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/80">
                  <span className="text-zinc-500 text-xs block font-medium">Designer / Brand</span>
                  <p className="font-semibold text-zinc-900 text-xs mt-1 truncate">{product.designer || 'FashionCo'}</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/80">
                  <span className="text-zinc-500 text-xs block font-medium">Stock Status</span>
                  <div className="mt-1"><StatusBadge status={product.status || (product.stock > 0 ? 'In Stock' : 'Out of Stock')} /></div>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/80">
                  <span className="text-zinc-500 text-xs block font-medium">Available Units</span>
                  <p className="font-machina font-bold text-zinc-900 text-sm mt-0.5">{product.stock} pcs</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200/80">
                  <span className="text-zinc-500 text-xs block font-medium">Selling Price</span>
                  <p className="font-machina font-bold text-zinc-900 text-sm mt-0.5">{formatCurrency(product.sellingPrice)}</p>
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
