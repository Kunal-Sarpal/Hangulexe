import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

import { useRouter } from '../../hooks/useRouter';
import Icons from '../../components/Icons';

export default function ProductListingPage({ categoryPath, likes = [], toggleLike = () => {} }) {
  const isAll = categoryPath === 'all' || !categoryPath;
  const genderTitle = isAll ? 'All' : (categoryPath.charAt(0).toUpperCase() + categoryPath.slice(1));
  const { trackEvent } = useAnalytics('/' + categoryPath);
  const { navigate } = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sort, setSort] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/store/products';
      const params = [];
      if (!isAll) {
        params.push(`gender=${genderTitle}`);
      }
      if (selectedCategories.length > 0) params.push(`category=${selectedCategories.join(',')}`);
      if (selectedSizes.length > 0) params.push(`sizes=${selectedSizes.join(',')}`);
      if (sort) params.push(`sort=${sort}`);

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Server status: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Fetch products error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // Record filter change
    trackEvent('filter_change', 'plp_filters', { gender: genderTitle, categories: selectedCategories, sizes: selectedSizes, sort });
  }, [categoryPath, selectedCategories, selectedSizes, sort]);

  const toggleFilter = (setState, value) => {
    setState(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handleProductClick = (product) => {
    trackEvent('click', `product_${product._id}`, { type: 'product', sku: product.sku });
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Left Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-8 hidden md:block">
        <div>
          <h3 className="font-bold text-gray-900 mb-4 flex justify-between">Filters <span className="text-sm font-normal text-yellow-500 cursor-pointer">Clear All</span></h3>
          
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
            <div className="space-y-2">
              {['T-Shirt', 'Shirt', 'Hoodies', 'Top', 'Accessories'].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600">
                  <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleFilter(setSelectedCategories, cat)} className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Sizes Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Sizes</h4>
            <div className="space-y-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <label key={size} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600">
                  <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => toggleFilter(setSelectedSizes, size)} className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
                  {size}
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Product Grid */}
      <div className="flex-1">
        {/* Header & Sort */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-xs text-gray-500 mb-2">Home &gt; {genderTitle} Clothing</div>
            <h1 className="text-2xl font-bold text-gray-900">{isAll ? 'All Clothing' : `Clothes for ${genderTitle}`} <span className="text-sm font-normal text-gray-500 ml-2">— {total} Products</span></h1>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 border border-[#E6E2DA] px-4 py-2 text-xs font-bold text-[#1C1B19] bg-white hover:bg-[#F5F3ED]"
            >
              <Icons.Filter className="w-3.5 h-3.5 text-[#1C1B19]" />
              <span>Filters</span>
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} className="border-b border-gray-300 py-1 pl-2 pr-6 text-xs text-[#1C1B19] bg-transparent outline-none cursor-pointer">
              <option value="popular">Popularity</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price Low-High</option>
              <option value="price_desc">Price High-Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p._id} onClick={() => handleProductClick(p)} className="group cursor-pointer">
                {/* Image Box */}
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img src={p.image_url} alt={p.product_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Like Button */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); toggleLike(p._id); }}
                    className="absolute top-2 right-2 bg-white bg-opacity-90 p-1.5 rounded-full text-gray-800 hover:text-red-500 transition-colors shadow-sm"
                  >
                    <div className={likes.includes(p._id) ? "text-red-500 fill-current" : ""}>
                      <Icons.Heart />
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {p.tags?.map(tag => (
                      <span key={tag} className="bg-white bg-opacity-90 text-[9px] font-bold px-1.5 py-0.5 rounded text-gray-800">{tag}</span>
                    ))}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 text-gray-800 shadow-sm">
                    <span className="text-yellow-500">★</span> {p.rating}
                  </div>
                </div>

                {/* Info Box */}
                <div className="space-y-1">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">FASHIONCO®</h3>
                  <p className="text-xs text-gray-800 truncate" title={p.product_name}>{p.product_name}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">₹{p.sellingPrice}</span>
                    <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                    <span className="text-[10px] font-bold text-green-600">{p.discount_percent}% OFF</span>
                  </div>
                  {/* Promo lines */}
                  <div className="text-[10px] text-gray-600 bg-gray-50 inline-block px-1.5 py-0.5 rounded mt-1 border border-gray-100">
                    Buy 3 get 10% off
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          {/* Backdrop */}
          <div onClick={() => setShowMobileFilters(false)} className="fixed inset-0 bg-black/45 backdrop-blur-sm" />
          
          {/* Drawer Content */}
          <div className="relative flex flex-col w-80 max-w-[85vw] bg-[#FAF9F6] border-l border-[#E6E2DA] h-full p-6 ml-auto shadow-2xl relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#1C1B19] text-sm uppercase tracking-wider">Filters</h3>
              <button 
                onClick={() => setShowMobileFilters(false)} 
                className="text-2xl font-light text-[#6E6A63] hover:text-[#1C1B19] cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-8 pr-2 text-left">
              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold text-[#6E6A63] uppercase tracking-wider mb-3">Category</h4>
                <div className="space-y-2.5">
                  {['T-Shirt', 'Shirt', 'Hoodies', 'Top', 'Accessories'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-[#1C1B19]">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat)} 
                        onChange={() => toggleFilter(setSelectedCategories, cat)} 
                        className="w-4 h-4 rounded border-[#E6E2DA] text-[#1C1B19] focus:ring-0 focus:ring-offset-0" 
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes Filter */}
              <div>
                <h4 className="text-xs font-bold text-[#6E6A63] uppercase tracking-wider mb-3">Sizes</h4>
                <div className="space-y-2.5">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <label key={size} className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-[#1C1B19]">
                      <input 
                        type="checkbox" 
                        checked={selectedSizes.includes(size)} 
                        onChange={() => toggleFilter(setSelectedSizes, size)} 
                        className="w-4 h-4 rounded border-[#E6E2DA] text-[#1C1B19] focus:ring-0 focus:ring-offset-0" 
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-[#1C1B19] text-[#FAF9F6] font-bold text-xs tracking-widest py-4 uppercase mt-6"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
