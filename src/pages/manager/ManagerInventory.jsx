import { useState, useEffect } from 'react';
import { apiGetProducts, apiCreateProduct, apiDeleteProduct } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import { FormField, inputCls, btnPrimary, btnSecondary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';

const INITIAL_PRODUCT_STATE = {
  name: '',
  sku: '',
  category: 'Ethnic Wear',
  gender: 'Women',
  model: '',
  designer: '',
  vendor: '',
  mrp: '',
  costPrice: '',
  purchasePrice: '',
  sellingPrice: '',
  stock: '',
  shelf: 'A1',
  sizes: 'S, M, L, XL',
  description: '',
  images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80']
};

const ManagerInventory = ({ navigateTo, showToast }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDesigner, setFilterDesigner] = useState('All');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ categories: ['All'], designers: ['All'], statuses: ['All', 'In Stock', 'Low Stock', 'Out of Stock'] });
  const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT_STATE);
  const [imageLinks, setImageLinks] = useState(['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80']);
  const perPage = 6;

  const fetchProducts = () => {
    const params = { page, limit: perPage };
    if (search) params.search = search;
    if (filterCategory !== 'All') params.category = filterCategory;
    if (filterStatus !== 'All') params.status = filterStatus;
    if (filterDesigner !== 'All') params.designer = filterDesigner;

    apiGetProducts(params).then(data => {
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.filters) setFilters(data.filters);
    }).catch(err => {
      console.error('Error fetching inventory products:', err);
    });
  };

  useEffect(() => { fetchProducts(); }, [page, search, filterCategory, filterStatus, filterDesigner]);

  const handleDeleteProduct = async (product) => {
    const prodName = product.name || product.product_name || 'this item';
    const targetId = product.product_id || product._id || product.sku;
    
    if (!window.confirm(`Are you sure you want to delete "${prodName}" from inventory?`)) return;

    try {
      await apiDeleteProduct(targetId);
      if (showToast) showToast(`Deleted "${prodName}" from inventory`, 'success');
      fetchProducts();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleAddImageLink = () => {
    setImageLinks(prev => [...prev, '']);
  };

  const handleUpdateImageLink = (index, value) => {
    setImageLinks(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleRemoveImageLink = (index) => {
    setImageLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = async () => {
    if (!newProduct.name) {
      showToast('Please enter a product name', 'error');
      return;
    }
    const cleanImages = imageLinks.filter(url => url && url.trim() !== '');
    if (cleanImages.length === 0) {
      cleanImages.push('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80');
    }

    try {
      const payload = {
        ...newProduct,
        images: cleanImages,
        image_url: cleanImages[0],
        sku: newProduct.sku || `SKU-${Date.now().toString().slice(-4)}`
      };
      await apiCreateProduct(payload);
      setShowAddModal(false);
      setNewProduct(INITIAL_PRODUCT_STATE);
      setImageLinks(['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80']);
      showToast('Product added successfully!');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to add product', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] w-full px-8 py-6 flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
        <div className="flex flex-col gap-2">
          <h2 className="text-[32px] font-bold text-[#111827] tracking-tight leading-none">Inventory</h2>
          <p className="text-[14px] text-[#6B7280] font-medium leading-none">{total} products in catalog</p>
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
            {filters.categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="h-11 rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] hover:border-[#D1D5DB] transition-all duration-200 cursor-pointer" style={{ paddingLeft: '16px', paddingRight: '36px', minWidth: '130px' }}>
            {filters.statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterDesigner} onChange={e => { setFilterDesigner(e.target.value); setPage(1); }} className="h-11 rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] hover:border-[#D1D5DB] transition-all duration-200 cursor-pointer" style={{ paddingLeft: '16px', paddingRight: '36px', minWidth: '140px' }}>
            {filters.designers.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        
        {/* Add Product Button */}
        <button onClick={() => setShowAddModal(true)} className="h-11 rounded-[10px] bg-[#2563EB] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-sm shadow-[#2563EB]/15 hover:shadow-md hover:shadow-[#2563EB]/20 cursor-pointer" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <Icons.Plus /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        {products.length === 0 ? <EmptyState title="No products found" subtitle="Try adjusting your filters" /> : (
          <>
            <TableWrapper>
              <thead><tr>
                <Th className="text-left">Product</Th>
                <Th className="text-left">SKU</Th>
                <Th className="text-left">Category</Th>
                <Th className="text-left">Designer</Th>
                <Th className="text-left">Vendor</Th>
                <Th className="text-right">MRP</Th>
                <Th className="text-right">Selling ₹</Th>
                <Th className="text-center">Stock</Th>
                <Th className="text-right">Sold</Th>
                <Th className="text-left">Status</Th>
                <Th className="text-center">Action</Th>
              </tr></thead>
              <tbody>
                {products.map((item, i) => {
                  const itemImages = item.images && item.images.length > 0 ? item.images : [item.image_url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'];
                  return (
                    <tr key={i} className="hover:bg-[#F9FAFB] transition-colors border-b border-[#F3F4F6] last:border-b-0">
                      <Td className="text-left">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img src={itemImages[0]} alt={item.name} className="w-full h-full object-cover" />
                            {itemImages.length > 1 && (
                              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                                +{itemImages.length - 1}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-[#111827] block text-sm">{item.name}</span>
                            <span className="text-xs text-slate-500">{item.gender || 'Women'}</span>
                          </div>
                        </div>
                      </Td>
                      <Td className="text-left"><span className="font-mono text-xs font-semibold text-[#2563EB]">{item.sku}</span></Td>
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
                      <Td className="text-right font-mono text-[#111827] tabular-nums">{item.sold || 0}</Td>
                      <Td className="text-left"><StatusBadge status={item.status} /></Td>
                      <Td className="text-center">
                        <button
                          onClick={() => handleDeleteProduct(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Delete Product from Catalog"
                        >
                          <Icons.Trash className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrapper>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product to Inventory" width="max-w-3xl">
        <div className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2">
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Product Name *">
              <input value={newProduct.name} className={inputCls} placeholder="e.g. Embroidered Velvet Lehenga" onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
            </FormField>
            <FormField label="SKU Code">
              <input value={newProduct.sku} className={inputCls} placeholder="e.g. SKU-109 (Auto-generated if empty)" onChange={e => setNewProduct(p => ({ ...p, sku: e.target.value }))} />
            </FormField>
            
            <FormField label="Category">
              <select value={newProduct.category} className={inputCls} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}>
                <option>Ethnic Wear</option>
                <option>Formals</option>
                <option>Casuals</option>
                <option>Western</option>
                <option>Fusion</option>
                <option>T-Shirt</option>
                <option>Top</option>
                <option>Accessories</option>
              </select>
            </FormField>
            
            <FormField label="Target Gender">
              <select value={newProduct.gender} className={inputCls} onChange={e => setNewProduct(p => ({ ...p, gender: e.target.value }))}>
                <option>Women</option>
                <option>Men</option>
                <option>Unisex</option>
              </select>
            </FormField>

            <FormField label="Designer / Brand">
              <input value={newProduct.designer} className={inputCls} placeholder="e.g. Manish Malhotra / Sabyasachi" onChange={e => setNewProduct(p => ({ ...p, designer: e.target.value }))} />
            </FormField>
            <FormField label="Supplier / Vendor">
              <input value={newProduct.vendor} className={inputCls} placeholder="e.g. Fabrics India Ltd." onChange={e => setNewProduct(p => ({ ...p, vendor: e.target.value }))} />
            </FormField>

            <FormField label="MRP Price (₹)">
              <input type="number" value={newProduct.mrp} className={inputCls} placeholder="15000" onChange={e => setNewProduct(p => ({ ...p, mrp: e.target.value }))} />
            </FormField>
            <FormField label="Selling Price (₹) *">
              <input type="number" value={newProduct.sellingPrice} className={inputCls} placeholder="12000" onChange={e => setNewProduct(p => ({ ...p, sellingPrice: e.target.value }))} />
            </FormField>

            <FormField label="Cost Price (₹)">
              <input type="number" value={newProduct.costPrice} className={inputCls} placeholder="6000" onChange={e => setNewProduct(p => ({ ...p, costPrice: e.target.value }))} />
            </FormField>
            <FormField label="Stock Quantity">
              <input type="number" value={newProduct.stock} className={inputCls} placeholder="25" onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} />
            </FormField>

            <FormField label="Shelf Location">
              <input value={newProduct.shelf} className={inputCls} placeholder="e.g. A1-102" onChange={e => setNewProduct(p => ({ ...p, shelf: e.target.value }))} />
            </FormField>

            <FormField label="Available Sizes">
              <input value={newProduct.sizes} className={inputCls} placeholder="S, M, L, XL" onChange={e => setNewProduct(p => ({ ...p, sizes: e.target.value }))} />
            </FormField>
          </div>

          <FormField label="Product Description">
            <textarea value={newProduct.description} rows={2} className={`${inputCls} h-auto py-2`} placeholder="Provide product details, fabric, embroidery..." onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} />
          </FormField>

          {/* Multiple Image URLs Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Product Image Links (Multiple Allowed)</h4>
                <p className="text-xs text-slate-500">Add URLs of images. Customers will be able to slide through all images!</p>
              </div>
              <button type="button" onClick={handleAddImageLink} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors">
                + Add Image Link
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {imageLinks.map((url, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 w-5">#{idx + 1}</span>
                  <input
                    type="url"
                    value={url}
                    onChange={e => handleUpdateImageLink(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/photo-xxx"
                    className={`${inputCls} flex-1`}
                  />
                  {url && (
                    <img src={url} alt="Preview" className="w-9 h-9 object-cover rounded-md border border-slate-200 bg-white" onError={(e) => e.target.style.display = 'none'} />
                  )}
                  {imageLinks.length > 1 && (
                    <button type="button" onClick={() => handleRemoveImageLink(idx)} className="text-red-500 hover:text-red-700 p-1 font-bold text-lg">
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowAddModal(false)} className={btnSecondary}>Cancel</button>
          <button onClick={handleAddProduct} className={btnPrimary}>Add Product</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerInventory;
