import { useState, useEffect } from 'react';
import { apiGetProducts, apiCreateProduct, apiDeleteProduct, apiUploadFile } from '../../api/api';
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

  const [localUploading, setLocalUploading] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');

  const startCamera = async (deviceId = '') => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      setCapturedPhoto(null);
      
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setShowCameraModal(true);
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devices.filter(device => device.kind === 'videoinput');
      setCameraDevices(videoDevs);
      
      if (!deviceId && videoDevs.length > 0) {
        const tracks = stream.getVideoTracks();
        if (tracks.length > 0) {
          const currentSettings = tracks[0].getSettings();
          if (currentSettings.deviceId) {
            setSelectedCameraId(currentSettings.deviceId);
          }
        }
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      showToast('Could not access camera. Please check permissions.', 'error');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCapturedPhoto(null);
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera-video-feed');
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const fileUrl = URL.createObjectURL(blob);
        setCapturedPhoto({ blob, previewUrl: fileUrl });
      }
    }, 'image/jpeg', 0.95);
  };

  const handleUploadSnapshot = async () => {
    if (!capturedPhoto) return;
    try {
      setLocalUploading(true);
      const file = new File([capturedPhoto.blob], `snapshot-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const res = await apiUploadFile(file);
      
      setImageLinks(prev => {
        const clean = prev.filter(url => url && url.trim() !== '');
        if (clean.length === 1 && clean[0] === INITIAL_PRODUCT_STATE.images[0]) {
          return [res.url];
        }
        return [...clean, res.url];
      });
      
      showToast('Snapshot uploaded successfully!');
      stopCamera();
    } catch (err) {
      console.error('Error uploading snapshot:', err);
      showToast(err.message || 'Failed to upload snapshot', 'error');
    } finally {
      setLocalUploading(false);
    }
  };

  const handleLocalFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLocalUploading(true);
    let successCount = 0;
    let newUrls = [];

    for (const file of files) {
      try {
        const res = await apiUploadFile(file);
        newUrls.push(res.url);
        successCount++;
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        showToast(`Failed to upload ${file.name}: ${err.message}`, 'error');
      }
    }

    if (newUrls.length > 0) {
      setImageLinks(prev => {
        const clean = prev.filter(url => url && url.trim() !== '');
        if (clean.length === 1 && clean[0] === INITIAL_PRODUCT_STATE.images[0]) {
          return [...newUrls];
        }
        return [...clean, ...newUrls];
      });
    }

    if (successCount > 0) {
      showToast(`Successfully uploaded ${successCount} image(s)!`);
    }
    setLocalUploading(false);
    e.target.value = '';
  };

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

          {/* S3 Image Uploader & Camera Snapshots Section */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Product Images</h4>
                <p className="text-xs text-slate-500">Upload images directly to S3 or capture instantly using your camera!</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="s3-image-upload-input"
                  className="hidden"
                  onChange={handleLocalFilesUpload}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('s3-image-upload-input').click()}
                  disabled={localUploading}
                  className="text-xs bg-white text-slate-700 hover:bg-slate-50 font-semibold px-3 py-2 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Files
                </button>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  disabled={localUploading}
                  className="text-xs bg-white text-slate-700 hover:bg-slate-50 font-semibold px-3 py-2 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Take Photo
                </button>
                <button
                  type="button"
                  onClick={handleAddImageLink}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-3 py-2 rounded-lg border border-blue-200 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                >
                  + Add Link
                </button>
              </div>
            </div>

            {localUploading && (
              <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold bg-blue-50/50 border border-blue-100 rounded-lg p-2.5">
                <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Uploading images directly to S3...
              </div>
            )}

            {/* List and preview input links */}
            <div className="flex flex-col gap-3">
              {imageLinks.map((url, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-xs font-mono font-bold text-slate-400 w-5 text-center">#{idx + 1}</span>
                  <input
                    type="url"
                    value={url}
                    onChange={e => handleUpdateImageLink(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/photo-xxx"
                    className="flex-1 text-xs border-0 bg-transparent py-1 focus:ring-0 focus:outline-none placeholder:text-slate-300 font-medium"
                  />
                  {url && (
                    <div className="relative w-9 h-9 rounded-md overflow-hidden bg-slate-50 border border-slate-200/60 shrink-0">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                  {imageLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageLink(idx)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                    >
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

      {/* Camera Capture Modal */}
      <Modal isOpen={showCameraModal} onClose={stopCamera} title="Camera Live Capture" width="max-w-2xl">
        <div className="flex flex-col gap-4 items-center">
          {capturedPhoto ? (
            <div className="relative w-full max-h-[50vh] overflow-hidden rounded-2xl border border-slate-200 bg-black flex items-center justify-center shadow-inner">
              <img src={capturedPhoto.previewUrl} alt="Captured preview" className="max-w-full max-h-[50vh] object-contain" />
            </div>
          ) : (
            <div className="relative w-full max-h-[50vh] overflow-hidden rounded-2xl border border-slate-200 bg-black flex items-center justify-center shadow-inner">
              <video
                id="camera-video-feed"
                autoPlay
                playsInline
                className="max-w-full max-h-[50vh] object-contain scale-x-[-1]"
                ref={(el) => {
                  if (el && cameraStream && el.srcObject !== cameraStream) {
                    el.srcObject = cameraStream;
                  }
                }}
              />
              {!cameraStream && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  Starting camera feed...
                </div>
              )}
            </div>
          )}

          {/* Camera Controls */}
          <div className="w-full flex flex-col gap-3">
            {cameraDevices.length > 1 && !capturedPhoto && (
              <div className="flex items-center gap-2 justify-center">
                <label className="text-xs font-semibold text-slate-500">Switch Camera:</label>
                <select
                  value={selectedCameraId}
                  onChange={(e) => {
                    setSelectedCameraId(e.target.value);
                    startCamera(e.target.value);
                  }}
                  className="text-xs bg-slate-100 rounded-lg p-1.5 border border-slate-200 focus:outline-none"
                >
                  {cameraDevices.map((device, idx) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-center gap-3">
              {capturedPhoto ? (
                <>
                  <button
                    onClick={() => startCamera(selectedCameraId)}
                    disabled={localUploading}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
                  >
                    Retake Photo
                  </button>
                  <button
                    onClick={handleUploadSnapshot}
                    disabled={localUploading}
                    className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] font-semibold text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {localUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Uploading...
                      </>
                    ) : (
                      'Upload Snapshot'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={stopCamera}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={!cameraStream}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Capture Photo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerInventory;
