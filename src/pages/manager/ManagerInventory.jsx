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
  images: []
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
  const [imageLinks, setImageLinks] = useState([]);
  const perPage = 6;
  const [modalTab, setModalTab] = useState('Product Info');

  const [localUploading, setLocalUploading] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [previewUrls, setPreviewUrls] = useState({});
  const [urlInput, setUrlInput] = useState('');

  const handleAddDirectUrl = () => {
    if (!urlInput.trim()) return;
    setImageLinks(prev => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

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
          return [res.key];
        }
        return [...clean, res.key];
      });

      setPreviewUrls(prev => ({ ...prev, [res.key]: res.url }));

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
    let newKeys = [];
    const newPreviews = {};

    for (const file of files) {
      try {
        const res = await apiUploadFile(file);
        newKeys.push(res.key);
        newPreviews[res.key] = res.url;
        successCount++;
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        showToast(`Failed to upload ${file.name}: ${err.message}`, 'error');
      }
    }

    if (newKeys.length > 0) {
      setImageLinks(prev => {
        const clean = prev.filter(url => url && url.trim() !== '');
        if (clean.length === 1 && clean[0] === INITIAL_PRODUCT_STATE.images[0]) {
          return [...newKeys];
        }
        return [...clean, ...newKeys];
      });
      setPreviewUrls(prev => ({ ...prev, ...newPreviews }));
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
      setImageLinks([]);
      showToast('Product added successfully!');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to add product', 'error');
    }
  };

  // Helper thumbnail component with automatic broken image fallback
  const ProductThumbnail = ({ src, alt }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setHasError(false);
    }, [src]);

    return (
      <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/90 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-2xs">
        {!hasError && src ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs font-bold">
            📦
          </div>
        )}
      </div>
    );
  };

  const inStockCount = products.filter(p => (parseInt(p.stock) || 0) >= 25).length;
  const lowStockCount = products.filter(p => (parseInt(p.stock) || 0) > 0 && (parseInt(p.stock) || 0) < 25).length;
  const outOfStockCount = products.filter(p => (parseInt(p.stock) || 0) === 0).length;

  const totalAssetValue = products.reduce((sum, p) => {
    const price = p.sellingPrice || p.mrp || 0;
    const stock = parseInt(p.stock) || 0;
    return sum + (price * (stock > 0 ? stock : 1));
  }, 0);

  const inStockPercent = total > 0 ? Math.round((inStockCount / total) * 100) : 50;
  const lowStockPercent = total > 0 ? Math.round((lowStockCount / total) * 100) : 30;
  const outOfStockPercent = total > 0 ? Math.max(0, 100 - inStockPercent - lowStockPercent) : 20;

  return (
    <div className="mx-auto max-w-[1400px] w-full px-8 py-6 flex flex-col gap-6 animate-fade-in text-left">

      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateTo('dashboard')}
          className="text-gray-400 hover:text-gray-700 text-sm font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>‹</span> Stocks
        </button>
      </div>

      {/* Zendenta Asset Value Card */}
      <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

        {/* Left: Total Asset Value */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-xl shrink-0 shadow-xs">
            ₹
          </div>
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              TOTAL ASSET VALUE
            </span>
            <span className="text-3xl font-black text-zinc-900 tracking-tight font-machina">
              {formatCurrency(totalAssetValue)}
            </span>
          </div>
        </div>

        {/* Right: Product Count & Segmented Color Progress Bar */}
        <div className="flex-1 max-w-md flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-xl font-bold text-zinc-900 font-machina">{total}</span>
            <span className="text-xs font-semibold text-zinc-400">product</span>
          </div>

          {/* Segmented Triple-Color Progress Bar */}
          <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden flex gap-0.5">
            <div
              style={{ width: `${inStockPercent}%` }}
              className="h-full bg-zinc-800 rounded-l-full transition-all duration-500"
              title={`In Stock: ${inStockCount}`}
            />
            <div
              style={{ width: `${lowStockPercent}%` }}
              className="h-full bg-amber-400 transition-all duration-500"
              title={`Low Stock: ${lowStockCount}`}
            />
            <div
              style={{ width: `${outOfStockPercent}%` }}
              className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
              title={`Out of Stock: ${outOfStockCount}`}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold mt-2.5">
            <span className="flex items-center gap-1.5 text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-zinc-800" />
              In stock: <strong className="text-zinc-900 font-machina">{inStockCount}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Low stock: <strong className="text-zinc-900 font-machina">{lowStockCount}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Out of stock: <strong className="text-zinc-900 font-machina">{outOfStockCount}</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-zinc-200/90 pb-px">
        <span className="text-sm font-bold pb-3 text-zinc-900 border-b-2 border-zinc-900 cursor-pointer">
          Inventory
        </span>
        <button
          onClick={() => navigateTo('inventory-layout')}
          className="text-sm font-bold pb-3 text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors"
        >
          Order Stock / Shelf Layout
        </button>
      </div>

      {/* Search & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72 h-9">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <Icons.Search />
          </span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name or SKU..."
            className="w-full h-full pl-9 pr-3 rounded-lg border border-zinc-200/90 hover:border-zinc-300 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 focus:border-zinc-900 transition-all shadow-2xs"
          />
        </div>

        {/* Right Actions: Filters & Add Product */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
              className="h-9 pl-3 pr-8 rounded-lg border border-zinc-200/90 hover:border-zinc-300 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300 focus:border-zinc-900 cursor-pointer transition-colors shadow-2xs appearance-none"
            >
              {filters.categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              className="h-9 pl-3 pr-8 rounded-lg border border-zinc-200/90 hover:border-zinc-300 bg-white text-xs font-semibold text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-300 focus:border-zinc-900 cursor-pointer transition-colors shadow-2xs appearance-none"
            >
              {filters.statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* New Product Button */}
          <button
            onClick={() => {
              setNewProduct(INITIAL_PRODUCT_STATE);
              setImageLinks([]);
              setModalTab('Product Info');
              setShowAddModal(true);
            }}
            className="cursor-pointer inline-flex items-center justify-center gap-2 h-9 px-4 bg-zinc-900 hover:bg-black text-white rounded-lg transition-all font-semibold shadow-xs active:scale-95 text-xs shrink-0"
          >
            <Icons.Plus className="w-4 h-4 text-white shrink-0" />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none overflow-hidden transition-all duration-300">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState title="No products found" subtitle="Try adjusting your search or filters" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">NAME ⇅</th>
                  <th className="py-4 px-4">CATEGORIES ⇅</th>
                  <th className="py-4 px-4">SKU ⇅</th>
                  <th className="py-4 px-4">VENDOR ⇅</th>
                  <th className="py-4 px-4">STOCK ⇅</th>
                  <th className="py-4 px-4 text-center">STATUS ⇅</th>
                  <th className="py-4 px-4 text-right">ASSET VALUE ⇅</th>
                  <th className="py-4 px-4 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-800">
                {products.map((item, i) => {
                  const itemImages = item.images && item.images.length > 0 ? item.images : [item.image_url || ''];
                  const stockNum = parseInt(item.stock) || 0;
                  const isOut = stockNum === 0;
                  const isLow = stockNum > 0 && stockNum < 25;
                  const isIn = stockNum >= 25;
                  const assetVal = (item.sellingPrice || 0) * (stockNum > 0 ? stockNum : 1);

                  return (
                    <tr key={item._id || item.sku || i} className="hover:bg-slate-50/70 transition-colors">

                      {/* NAME */}
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <ProductThumbnail src={itemImages[0]} alt={item.name} />
                          <div>
                            <span className="font-bold text-gray-900 block text-xs">{item.name}</span>
                            <span className="text-[11px] text-gray-400 font-normal">{item.gender || 'Collection'}</span>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORIES */}
                      <td className="py-3 px-4 text-zinc-600 font-medium">
                        {item.category || 'Apparel'}
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-machina font-bold text-zinc-900">
                        {item.sku}
                      </td>

                      {/* VENDOR */}
                      <td className="py-3 px-4 text-zinc-600 font-medium">
                        {item.vendor || item.designer || 'Fashion Co'}
                      </td>

                      {/* STOCK */}
                      <td className="py-3 px-4 font-machina font-bold text-zinc-900">
                        {stockNum}
                      </td>

                      {/* STATUS */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <StatusBadge status={isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'} />
                        </div>
                      </td>

                      {/* ASSET VALUE */}
                      <td className="py-3 px-4 text-right font-bold text-zinc-900 font-machina">
                        {formatCurrency(assetVal)}
                      </td>

                      {/* ACTION (3-dots or Delete) */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteProduct(item)}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Icons.Trash className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 px-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Showing Page {page} of {totalPages} ({total} Products)</span>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Add Product Modal styled after Reference Image 1 */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => { setShowAddModal(false); setModalTab('Product Info'); }} 
        title="Add New Product to Inventory" 
        subtitle="Configure catalog specifications, pricing tiers, and media assets for this boutique item."
        tabs={['Product Info', 'Pricing & Stock', 'Media & Assets']}
        activeTab={modalTab}
        onTabChange={setModalTab}
        width="max-w-2xl"
      >
        <div className="flex flex-col gap-5 text-left">

          {modalTab === 'Product Info' && (
            <div className="space-y-4 animate-fade-in">
              {/* Product Name */}
              <FormField 
                label="Product Name *" 
                helper="The public display title shown to customers on the boutique catalog."
              >
                <input 
                  value={newProduct.name} 
                  className={inputCls} 
                  placeholder="e.g. Embroidered Velvet Lehenga" 
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} 
                />
              </FormField>

              {/* Designer / Tagline */}
              <FormField 
                label="Designer / Brand Label" 
                helper="Couture house or designer behind this handcrafted garment."
              >
                <input 
                  value={newProduct.designer} 
                  className={inputCls} 
                  placeholder="e.g. Sabyasachi Couture / Manish Malhotra" 
                  onChange={e => setNewProduct(p => ({ ...p, designer: e.target.value }))} 
                />
              </FormField>

              {/* Category & Target Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Category" helper="Garment collection classification.">
                  <select 
                    value={newProduct.category} 
                    className={inputCls} 
                    onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  >
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

                <FormField label="Target Department" helper="Intended customer section.">
                  <select 
                    value={newProduct.gender} 
                    className={inputCls} 
                    onChange={e => setNewProduct(p => ({ ...p, gender: e.target.value }))}
                  >
                    <option>Women</option>
                    <option>Men</option>
                    <option>Unisex</option>
                  </select>
                </FormField>
              </div>

              {/* Description with character counter */}
              <FormField 
                label="Add a description" 
                hint={`${newProduct.description?.length || 0}/200`}
                helper="Brief summary displayed to potential buyers when browsing items."
              >
                <textarea 
                  value={newProduct.description} 
                  maxLength={200}
                  rows={3} 
                  className={`${inputCls} h-auto py-2.5 resize-none`} 
                  placeholder="Tell customers about fabric, threadwork, fit, and styling recommendations..." 
                  onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} 
                />
              </FormField>

              {/* Available Sizes / Tags */}
              <FormField 
                label="Available Sizes & Fit Tags" 
                helper="Sizes available for this product (e.g. S, M, L, XL) for easy search & filters."
              >
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">#</span>
                    <input 
                      value={newProduct.sizes.split(',')[0]?.trim() || 'S'} 
                      onChange={e => {
                        const parts = newProduct.sizes.split(',').map(s => s.trim());
                        parts[0] = e.target.value;
                        setNewProduct(p => ({ ...p, sizes: parts.join(', ') }));
                      }}
                      className={`${inputCls} pl-7`} 
                      placeholder="Size 1" 
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">#</span>
                    <input 
                      value={newProduct.sizes.split(',')[1]?.trim() || 'M'} 
                      onChange={e => {
                        const parts = newProduct.sizes.split(',').map(s => s.trim());
                        parts[1] = e.target.value;
                        setNewProduct(p => ({ ...p, sizes: parts.join(', ') }));
                      }}
                      className={`${inputCls} pl-7`} 
                      placeholder="Size 2" 
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">#</span>
                    <input 
                      value={newProduct.sizes.split(',')[2]?.trim() || 'L'} 
                      onChange={e => {
                        const parts = newProduct.sizes.split(',').map(s => s.trim());
                        parts[2] = e.target.value;
                        setNewProduct(p => ({ ...p, sizes: parts.join(', ') }));
                      }}
                      className={`${inputCls} pl-7`} 
                      placeholder="Size 3" 
                    />
                  </div>
                </div>
              </FormField>
            </div>
          )}

          {modalTab === 'Pricing & Stock' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Selling Price (₹) *" helper="Actual customer purchase price at checkout.">
                  <input 
                    type="number" 
                    value={newProduct.sellingPrice} 
                    className={inputCls} 
                    placeholder="12000" 
                    onChange={e => setNewProduct(p => ({ ...p, sellingPrice: e.target.value }))} 
                  />
                </FormField>

                <FormField label="MRP Price (₹)" helper="Original label retail price before markdown.">
                  <input 
                    type="number" 
                    value={newProduct.mrp} 
                    className={inputCls} 
                    placeholder="15000" 
                    onChange={e => setNewProduct(p => ({ ...p, mrp: e.target.value }))} 
                  />
                </FormField>

                <FormField label="Cost Price (₹)" helper="Manufacturing or procurement unit cost.">
                  <input 
                    type="number" 
                    value={newProduct.costPrice} 
                    className={inputCls} 
                    placeholder="6000" 
                    onChange={e => setNewProduct(p => ({ ...p, costPrice: e.target.value }))} 
                  />
                </FormField>

                <FormField label="Stock Quantity *" helper="Total physical items in showroom or warehouse.">
                  <input 
                    type="number" 
                    value={newProduct.stock} 
                    className={inputCls} 
                    placeholder="25" 
                    onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} 
                  />
                </FormField>

                <FormField label="SKU Barcode" helper="Unique product code (auto-generated if empty).">
                  <input 
                    value={newProduct.sku} 
                    className={inputCls} 
                    placeholder="e.g. SKU-109" 
                    onChange={e => setNewProduct(p => ({ ...p, sku: e.target.value }))} 
                  />
                </FormField>

                <FormField label="Shelf / Rack Slot" helper="Exact boutique aisle or shelf position.">
                  <input 
                    value={newProduct.shelf} 
                    className={inputCls} 
                    placeholder="e.g. A1-102" 
                    onChange={e => setNewProduct(p => ({ ...p, shelf: e.target.value }))} 
                  />
                </FormField>
              </div>

              <FormField label="Supplier / Vendor" helper="Textile mill or garment manufacturing source.">
                <input 
                  value={newProduct.vendor} 
                  className={inputCls} 
                  placeholder="e.g. Fabrics India Ltd." 
                  onChange={e => setNewProduct(p => ({ ...p, vendor: e.target.value }))} 
                />
              </FormField>
            </div>
          )}

          {modalTab === 'Media & Assets' && (
            <div className="space-y-4 animate-fade-in text-left">
              <input
                type="file"
                multiple
                accept="image/*"
                id="s3-image-upload-input"
                className="hidden"
                onChange={handleLocalFilesUpload}
              />

              {/* 3 Dedicated Media Action Cards */}
              <div className="grid grid-cols-3 gap-3">
                {/* 1. Upload Files */}
                <button
                  type="button"
                  onClick={() => document.getElementById('s3-image-upload-input').click()}
                  className="p-3.5 rounded-xl border border-zinc-200/90 hover:border-zinc-900 bg-white hover:bg-zinc-50 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xs group active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-900 text-zinc-700 group-hover:text-white transition-colors flex items-center justify-center mb-2 shadow-2xs">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">Upload Files</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG, WEBP</span>
                </button>

                {/* 2. Live Camera */}
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="p-3.5 rounded-xl border border-zinc-200/90 hover:border-zinc-900 bg-white hover:bg-zinc-50 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xs group active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-900 text-zinc-700 group-hover:text-white transition-colors flex items-center justify-center mb-2 shadow-2xs">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">Live Camera</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Take Snapshot</span>
                </button>

                {/* 3. Add via URL Focus */}
                <button
                  type="button"
                  onClick={() => document.getElementById('direct-url-input')?.focus()}
                  className="p-3.5 rounded-xl border border-zinc-200/90 hover:border-zinc-900 bg-white hover:bg-zinc-50 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xs group active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-900 text-zinc-700 group-hover:text-white transition-colors flex items-center justify-center mb-2 shadow-2xs">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-zinc-900">Add via URL</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Paste Web Link</span>
                </button>
              </div>

              {/* Direct Fast URL Input Bar */}
              <div className="flex items-center gap-2 bg-zinc-50 p-2 rounded-xl border border-zinc-200/90">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">🔗</span>
                  <input
                    id="direct-url-input"
                    type="url"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddDirectUrl(); } }}
                    placeholder="Paste image link (e.g. https://images.unsplash.com/...)..."
                    className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddDirectUrl}
                  disabled={!urlInput.trim()}
                  className="h-9 px-4 bg-zinc-900 hover:bg-black disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 active:scale-95"
                >
                  + Add URL
                </button>
              </div>

              {localUploading && (
                <div className="flex items-center gap-2 text-xs text-zinc-800 font-semibold bg-zinc-100 border border-zinc-200 rounded-xl p-3">
                  <svg className="animate-spin h-4 w-4 text-zinc-800" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Uploading product photography directly to storage...
                </div>
              )}

              {/* Sexy Visual Gallery Grid */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Product Showcase ({imageLinks.filter(Boolean).length})
                  </h4>
                  <span className="text-[11px] text-zinc-400">Hover photo to delete</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imageLinks.map((url, idx) => {
                    const displayUrl = previewUrls[url] || url;
                    return (
                      <div 
                        key={idx} 
                        className="relative group aspect-square rounded-2xl overflow-hidden border border-zinc-200/90 bg-zinc-50 shadow-2xs hover:shadow-md transition-all duration-300 flex items-center justify-center"
                      >
                        {url ? (
                          <>
                            <img 
                              src={displayUrl} 
                              alt={`Product image ${idx + 1}`} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                              onError={e => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80';
                              }} 
                            />
                            {/* Hover Action Overlay */}
                            <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveImageLink(idx)}
                                className="w-8 h-8 rounded-full bg-white text-zinc-700 hover:bg-rose-500 hover:text-white flex items-center justify-center text-xs font-bold shadow-lg transition-all cursor-pointer active:scale-90"
                                title="Remove photo"
                              >
                                ✕
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="p-2 w-full flex flex-col gap-1.5">
                            <input 
                              type="text" 
                              value={url} 
                              onChange={e => handleUpdateImageLink(idx, e.target.value)}
                              placeholder="Paste image URL..." 
                              className="w-full text-xs p-1.5 border border-zinc-300 rounded-lg text-center focus:outline-none focus:border-zinc-900 bg-white"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImageLink(idx)}
                              className="text-[10px] text-zinc-400 hover:text-rose-500"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add More Slot */}
                  <button
                    type="button"
                    onClick={() => document.getElementById('s3-image-upload-input').click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 hover:border-zinc-900 bg-zinc-50/50 hover:bg-zinc-100/70 flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-zinc-800 transition-all cursor-pointer group active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-zinc-900 text-zinc-500 group-hover:text-white flex items-center justify-center text-lg font-bold transition-colors">
                      +
                    </div>
                    <span className="text-xs font-semibold">Add Photo</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-zinc-200">
          <button 
            type="button" 
            onClick={() => { setShowAddModal(false); setModalTab('Product Info'); }} 
            className={btnSecondary}
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {modalTab !== 'Media & Assets' ? (
              <button 
                type="button" 
                onClick={() => setModalTab(modalTab === 'Product Info' ? 'Pricing & Stock' : 'Media & Assets')} 
                className="cursor-pointer group relative inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-zinc-100 text-zinc-800 rounded-full hover:bg-zinc-200 transition-all font-semibold active:scale-95 text-xs"
              >
                Next Step →
              </button>
            ) : null}
            <button 
              type="button" 
              onClick={handleAddProduct} 
              className={btnPrimary}
            >
              Add Product
            </button>
          </div>
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
