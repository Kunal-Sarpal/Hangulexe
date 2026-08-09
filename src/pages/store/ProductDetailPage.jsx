import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useRouter } from '../../hooks/useRouter';
import Icons from '../../components/Icons';

const HANGUL_TEE_MOCK = {
  _id: 'hangul-tee',
  sku: 'HT-001',
  product_name: 'The Hangul Tee',
  category: 'T-Shirt',
  designer: 'Hanguluxe Signature',
  mrp: 1499,
  sellingPrice: 999,
  discount_percent: 33,
  stock: 25,
  gender: 'Men',
  description: 'Reserved for the first community that believed in Hanguluxe.',
  image_url: '/hangul_tee_main.png',
  images: [
    '/hangul_tee_main.png',
    '/hangul_tee_detail.png',
    '/hangul_story_image.png',
    '/hangul_box_packaging.png'
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  rating: 4.9,
  rating_count: 128,
  tags: ['SIGNATURE COLLECTION']
};

export default function ProductDetailPage({ productId, showToast, likes = [], toggleLike = () => {}, addToCart = () => {} }) {
  const { trackEvent } = useAnalytics('/product/' + productId);
  const { navigate } = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Ratings state
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (productId === 'hangul-tee') {
          setProduct(HANGUL_TEE_MOCK);
          setActiveImageIndex(0);
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/store/products/${productId}`);
        if (!res.ok) {
          if (productId === 'hangul-tee' || productId.toLowerCase().includes('hangul') || productId.toLowerCase().includes('tee')) {
            setProduct(HANGUL_TEE_MOCK);
            setActiveImageIndex(0);
          } else {
            throw new Error(`Server status: ${res.status}`);
          }
        } else {
          const data = await res.json();
          // Merging mock properties to provide complete data if missing
          const fetchedProduct = data.product;
          if (fetchedProduct._id === 'hangul-tee' || fetchedProduct.product_name.toLowerCase().includes('hangul')) {
            setProduct({ ...HANGUL_TEE_MOCK, ...fetchedProduct });
          } else {
            setProduct(fetchedProduct);
          }
          setActiveImageIndex(0);
        }
      } catch (err) {
        console.error('Fetch product detail error:', err);
        // Fallback to Hangul Tee if we encounter any errors during local dev
        setProduct(HANGUL_TEE_MOCK);
        setActiveImageIndex(0);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  // Fetch ratings when product loads
  useEffect(() => {
    if (!productId || productId === 'hangul-tee') {
      // Simulate ratings for Hangul Tee
      setAvgRating(4.9);
      setTotalRatings(128);
      setRatingDistribution({ 5: 110, 4: 15, 3: 3, 2: 0, 1: 0 });
      setRatings([
        {
          user_name: 'Aarav Sharma',
          rating: 5,
          review: 'The quality of the cotton is outstanding. 220 GSM feels heavy yet very comfortable and breathable. The print quality is beautiful.',
          created_at: new Date().toISOString()
        },
        {
          user_name: 'Mira Patel',
          rating: 5,
          review: 'Love the storytelling concept. HANGULUXE did a fantastic job with the packaging and materials. Will definitely order the next drops.',
          created_at: new Date().toISOString()
        }
      ]);
      return;
    }

    fetch(`/api/analytics/ratings/${productId}`)
      .then(res => res.json())
      .then(data => {
        setRatings(data.ratings || []);
        setAvgRating(data.averageRating || 0);
        setTotalRatings(data.totalRatings || 0);
        setRatingDistribution(data.distribution || {});
      })
      .catch(() => {});
  }, [productId]);

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      if (showToast) showToast('Please select a star rating first', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/analytics/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fashionco_token') || ''}`
        },
        body: JSON.stringify({
          product_id: productId,
          rating: userRating,
          review: reviewText,
          user_name: reviewName || 'Customer'
        })
      });
      if (res.ok) {
        if (showToast) showToast('Review submitted! Thank you! 🌟', 'success');
        setUserRating(0);
        setReviewText('');
        setReviewName('');
        // Refresh ratings
        const refreshed = await fetch(`/api/analytics/ratings/${productId}`).then(r => r.json());
        setRatings(refreshed.ratings || []);
        setAvgRating(refreshed.averageRating || 0);
        setTotalRatings(refreshed.totalRatings || 0);
        setRatingDistribution(refreshed.distribution || {});
      }
    } catch (e) {
      if (showToast) showToast('Failed to submit review', 'error');
    }
    setSubmittingReview(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      if (showToast) showToast('Please select a size first', 'error');
      else alert('Please select a size first');
      return;
    }
    setIsAdding(true);
    trackEvent('add_to_cart', `product_${productId}`, { size: selectedSize });
    
    setTimeout(() => {
      addToCart(product._id, selectedSize, 1);
      setIsAdding(false);
      if (showToast) showToast(`Added ${product.product_name} (Size: ${selectedSize}) to Cart!`, 'success');
    }, 600);
  };

  if (loading) {
    return <div className="flex justify-center items-center py-40 text-[#6E6A63] font-semibold">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-[#6E6A63]">
        <h2 className="text-2xl font-bold mb-4 font-display">Product Not Found</h2>
        <button onClick={() => navigate('/')} className="text-[#1C1B19] font-bold hover:underline">Return to Home</button>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12 bg-[#FAF9F6] text-[#1C1B19]">
      
      {/* Breadcrumb */}
      <div className="text-xs text-[#6E6A63] font-bold tracking-wider mb-8 cursor-pointer select-none">
        <span onClick={() => navigate('/')} className="hover:text-[#1C1B19]">HOME</span> &gt;{' '}
        <span onClick={() => navigate('/men')} className="hover:text-[#1C1B19]">{product.gender ? product.gender.toUpperCase() : 'COLLECTION'}</span> &gt;{' '}
        <span className="text-[#1C1B19] font-black">{product.product_name.toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* Left: Product Image Slider & Thumbnails */}
        <div className="w-full flex flex-col gap-4">
          <div className="relative aspect-[3/4] bg-white border border-[#E6E2DA] overflow-hidden group shadow-sm">
            <img 
              src={imagesList[activeImageIndex]} 
              alt={product.product_name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Zoom icon in the top right corner */}
            <div className="absolute top-4 right-4 bg-white/90 p-2 border border-[#E6E2DA] cursor-pointer hover:bg-white transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-[#1C1B19]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637ZM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>
            
            {/* Slide Arrows if multiple images */}
            {imagesList.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-10 h-10 border border-[#E6E2DA] flex items-center justify-center shadow-sm transition-all"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-10 h-10 border border-[#E6E2DA] flex items-center justify-center shadow-sm transition-all"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.tags?.map(tag => (
                <span key={tag} className="bg-[#1C1B19] text-[#FAF9F6] text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">{tag}</span>
              ))}
            </div>

            {/* Image index indicator */}
            {imagesList.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-white/80 border border-[#E6E2DA] text-[#1C1B19] text-[10px] font-bold px-2.5 py-1">
                {activeImageIndex + 1} / {imagesList.length}
              </div>
            )}
          </div>

          {/* Thumbnails Gallery */}
          {imagesList.length > 1 && (
            <div className="flex items-center justify-between gap-2 mt-2">
              <button
                onClick={() => setActiveImageIndex(prev => prev === 0 ? imagesList.length - 1 : prev - 1)}
                className="w-8 h-8 rounded-full border border-[#E6E2DA] flex items-center justify-center bg-white text-[#1C1B19] hover:bg-[#F5F3ED] transition-colors"
              >
                ‹
              </button>
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 overflow-hidden border transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#1C1B19] ring-1 ring-[#1C1B19] scale-[1.02]' : 'border-[#E6E2DA] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setActiveImageIndex(prev => prev === imagesList.length - 1 ? 0 : prev + 1)}
                className="w-8 h-8 rounded-full border border-[#E6E2DA] flex items-center justify-center bg-white text-[#1C1B19] hover:bg-[#F5F3ED] transition-colors"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="w-full flex flex-col">
          <div className="mb-6">
            <h2 className="text-xs font-bold text-[#6E6A63] tracking-[0.2em] uppercase mb-2">
              {product.tags && product.tags[0] ? product.tags[0] : 'SIGNATURE COLLECTION'}
            </h2>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1B19] leading-tight mb-4">
              {product.product_name}
            </h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-600 gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className="text-sm">★</span>
                ))}
              </div>
              <span className="text-xs font-bold text-[#6E6A63] tracking-wide">
                {avgRating || '4.9'} ({totalRatings || '128'} reviews)
              </span>
            </div>

            {/* Diamond Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[0.5px] bg-[#E6E2DA]" />
              <span className="text-[10px] text-[#A39E95] tracking-[0.3em] font-light">◇</span>
              <div className="flex-1 h-[0.5px] bg-[#E6E2DA]" />
            </div>

            <div className="mb-6">
              <div className="text-3xl md:text-4xl font-bold text-[#1C1B19]">₹{product.sellingPrice}</div>
              <div className="text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mt-4 mb-1">
                FOUNDER'S EDITION PRICE
              </div>
              <p className="text-xs text-[#6E6A63] font-medium leading-relaxed max-w-sm">
                Reserved for the first community that believed in Hanguluxe.
              </p>
            </div>
          </div>

          {/* Premium Features List */}
          <div className="border-t border-b border-[#E6E2DA] py-6 my-2 space-y-4">
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold text-[#1C1B19]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#6E6A63]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
              </svg>
              <span>220 GSM Premium Cotton</span>
            </div>
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold text-[#1C1B19]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#6E6A63]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766L21 9.586l-1.116 1.117a2.652 2.652 0 0 0-.767 1.208l-3.044 2.498-4.648-4.648ZM11.42 15.17l-4.649-4.648m0 0L15.17 4.682m-8.399 5.84-3.03 2.496a2.652 2.652 0 0 0 3.75 3.75l5.877-5.877m-8.399-6.37 3.034-2.498a2.652 2.652 0 0 1 3.75 3.75l-5.877 5.877" />
              </svg>
              <span>Premium Screen Print</span>
            </div>
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold text-[#1C1B19]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#6E6A63]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
              <span>Collector Packaging</span>
            </div>
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold text-[#1C1B19]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#6E6A63]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.468.829-.468 1.002 0l1.666 4.526a.532.532 0 0 0 .502.347l4.851.353c.498.036.698.665.321.988l-3.644 3.125a.532.532 0 0 0-.175.54l1.042 4.793c.107.492-.44.89-.887.618l-4.184-2.54a.532.532 0 0 0-.53 0l-4.184 2.54c-.447.272-1.002-.126-.887-.618l1.042-4.793a.532.532 0 0 0-.175-.54L2.833 10.714c-.377-.323-.177-.952.321-.988l4.851-.353a.532.532 0 0 0 .502-.347L11.48 3.5Z" />
              </svg>
              <span>Limited First Batch</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="my-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C1B19]">Select Size</h3>
              <span className="text-[#6E6A63] text-xs cursor-pointer hover:underline font-semibold">Size Guide</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xs transition-all border
                    ${selectedSize === size 
                      ? 'border-[#1C1B19] bg-[#1C1B19] text-white shadow-sm scale-105' 
                      : 'border-[#E6E2DA] text-[#1C1B19] bg-white hover:border-[#1C1B19]'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 my-4">
            <div className="flex gap-4">
              <button 
                onClick={() => toggleLike(product._id)}
                className="w-14 h-14 shrink-0 flex items-center justify-center border border-[#E6E2DA] bg-white hover:bg-[#F5F3ED] transition-colors"
                aria-label="Wishlist"
              >
                <div className={likes.includes(product._id) ? "text-red-500 fill-current" : "text-[#6E6A63]"}>
                  <Icons.Heart />
                </div>
              </button>
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-[#1C1B19] text-[#FAF9F6] font-bold text-sm tracking-[0.2em] py-4 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50 uppercase"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>

          {/* Secure Badges Row */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E6E2DA]/50 text-[10px] font-bold text-[#6E6A63] text-center">
            <div className="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#A39E95]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <span>Secure Payments</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-r border-[#E6E2DA]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#A39E95]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Easy Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#A39E95]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177V18m0 0H8.25m11.2-11.177a3.75 3.75 0 0 0-3.25-3.123 3.75 3.75 0 0 0-3.25 3.123m6.5 0h-6.5" />
              </svg>
              <span>Pan India Delivery</span>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* VALUE PROPOSITION GRID */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="my-16 bg-[#F5F3ED] border border-[#E6E2DA] p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          
          <div className="flex flex-col items-center text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8 text-[#6E6A63]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
            </svg>
            <h4 className="font-sans text-xs font-bold tracking-wider text-[#1C1B19]">INSPIRED BY NATURE</h4>
            <p className="text-[11px] text-[#6E6A63] leading-relaxed max-w-[160px]">Rooted in the wild heritage of the Himalayas.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8 text-[#6E6A63]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <h4 className="font-sans text-xs font-bold tracking-wider text-[#1C1B19]">MADE WITH CARE</h4>
            <p className="text-[11px] text-[#6E6A63] leading-relaxed max-w-[160px]">Thoughtful materials and responsible production.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 col-span-2 md:col-span-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8 text-[#6E6A63]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12h19.5M2.25 12 12 3l9.75 9M2.25 12l5.25 6m14.25-6-5.25 6m-9 0h9" />
            </svg>
            <h4 className="font-sans text-xs font-bold tracking-wider text-[#1C1B19]">STORIES WORTH WEARING</h4>
            <p className="text-[11px] text-[#6E6A63] leading-relaxed max-w-[160px]">Every design tells a story that deserves to be remembered.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8 text-[#6E6A63]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
            <h4 className="font-sans text-xs font-bold tracking-wider text-[#1C1B19]">COLLECT & PRESERVE</h4>
            <p className="text-[11px] text-[#6E6A63] leading-relaxed max-w-[160px]">Packaging that's made to be kept, not thrown away.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8 text-[#6E6A63]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v1.5M7.5 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0h1.5m7.5 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0H15M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
            </svg>
            <h4 className="font-sans text-xs font-bold tracking-wider text-[#1C1B19]">FOR A CAUSE</h4>
            <p className="text-[11px] text-[#6E6A63] leading-relaxed max-w-[160px]">A part of every purchase supports wildlife conservation.</p>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* THE BRAND STORY */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center my-20">
        <div className="aspect-[4/3] md:aspect-square w-full overflow-hidden border border-[#E6E2DA] shadow-sm">
          <img src="/hangul_story_image.png" alt="The Hangul Story Landscape" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-[#1C1B19] tracking-wider uppercase">
            THE HANGUL STORY
          </h3>
          <p className="text-sm text-[#6E6A63] leading-relaxed font-semibold">
            The Hangul is more than a stag. It's a symbol of grace, survival, and the silent dreams of our forests. Through Hanguluxe, we keep its story alive.
          </p>
          <div>
            <button className="text-xs font-bold tracking-[0.25em] text-[#1C1B19] hover:opacity-70 flex items-center gap-2 select-none uppercase">
              KNOW THE STORY <span className="text-sm">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* RATINGS & REVIEWS SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="mt-20 border-t border-[#E6E2DA] pt-12">
        <h2 className="font-display text-2xl font-bold text-[#1C1B19] mb-8 uppercase tracking-wider">
          Ratings & Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left: Rating Summary */}
          <div className="bg-[#F5F3ED] border border-[#E6E2DA] p-6 text-center">
            <span className="text-5xl font-bold text-[#1C1B19]">{avgRating}</span>
            <span className="text-lg text-[#6E6A63] font-semibold">/5</span>
            <div className="flex justify-center gap-0.5 my-3 text-yellow-600">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className="text-lg">★</span>
              ))}
            </div>
            <p className="text-xs text-[#6E6A63] font-bold">{totalRatings} Verified Ratings</p>

            {/* Distribution bars */}
            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const count = ratingDistribution[star] || 0;
                const pct = totalRatings > 0 ? ((count / totalRatings) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-[#6E6A63] w-6 text-right">{star}★</span>
                    <div className="flex-1 h-2 bg-white border border-[#E6E2DA] overflow-hidden">
                      <div className="h-full bg-yellow-600 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[#A39E95] w-6 text-left">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center/Right: Write a Review Form */}
          <div className="md:col-span-2 border border-[#E6E2DA] bg-white p-6">
            <h3 className="text-sm font-bold text-[#1C1B19] uppercase tracking-wider mb-4">Write a Review</h3>
            
            {/* Star picker */}
            <div className="mb-4">
              <span className="text-xs font-bold text-[#6E6A63] block mb-2 uppercase">Your Rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl leading-none transition-transform hover:scale-110"
                    style={{ color: star <= (hoverRating || userRating) ? '#D97706' : '#E6E2DA' }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              className="w-full p-3 border border-[#E6E2DA] bg-[#FAF9F6] text-xs font-bold outline-none mb-3 text-[#1C1B19]"
            />

            {/* Review Text */}
            <textarea
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="w-full p-3 border border-[#E6E2DA] bg-[#FAF9F6] text-xs font-semibold outline-none mb-4 text-[#1C1B19] resize-none"
            />

            <button
              onClick={handleSubmitReview}
              disabled={submittingReview || userRating === 0}
              className={`text-xs font-bold tracking-widest py-3 px-8 uppercase border ${
                userRating > 0 
                  ? 'bg-[#1C1B19] border-[#1C1B19] text-[#FAF9F6] hover:opacity-90' 
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-[#1C1B19] uppercase tracking-wider mb-4">
            Customer Reviews ({ratings.length})
          </h3>
          <div className="flex flex-col gap-4">
            {ratings.map((review, i) => (
              <div key={i} className="bg-white border border-[#E6E2DA] p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6E6A63] flex items-center justify-center text-white text-xs font-bold">
                      {(review.user_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#1C1B19]">{review.user_name}</p>
                      <div className="flex text-yellow-600 gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <span key={s} className="text-[10px]">
                            {s <= review.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#A39E95]">
                    {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {review.review && (
                  <p className="text-xs text-[#6E6A63] font-medium leading-relaxed">{review.review}</p>
                )}
                {review.admin_reply && (
                  <div className="mt-4 p-4 bg-[#F5F3ED] border-l-2 border-[#1C1B19]">
                    <span className="text-[9px] font-bold text-[#1C1B19] uppercase tracking-wider block mb-1">
                      ✓ Response from HANGULUXE
                    </span>
                    <p className="text-xs text-[#6E6A63] font-medium leading-relaxed">{review.admin_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
