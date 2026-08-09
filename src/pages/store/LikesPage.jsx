import React, { useState, useEffect } from 'react';
import { useRouter } from '../../hooks/useRouter';
import Icons from '../../components/Icons';

export default function LikesPage({ likes, toggleLike }) {
  const { navigate } = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (!likes || likes.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url = `/api/store/products?ids=${likes.join(',')}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Server status: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Fetch liked products error:', err);
      }
      setLoading(false);
    };

    fetchLikedProducts();
  }, [likes]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-xs text-gray-500 mb-2 cursor-pointer hover:text-gray-900" onClick={() => navigate('/')}>
            Home &gt; Wishlist
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Wishlist <span className="text-sm font-normal text-gray-500 ml-2">— {likes.length} Items</span>
          </h1>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">Loading wishlist...</div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="text-gray-300 mb-4">
            <Icons.Heart className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Explore more and shortlist some items.</p>
          <button 
            onClick={() => navigate('/men')}
            className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-lg shadow-sm hover:bg-yellow-500 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p._id} onClick={() => navigate(`/product/${p._id}`)} className="group cursor-pointer">
              {/* Image Box */}
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img src={p.image_url} alt={p.product_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Like Button */}
                <div 
                  onClick={(e) => { e.stopPropagation(); toggleLike(p._id); }}
                  className="absolute top-2 right-2 bg-white bg-opacity-90 p-1.5 rounded-full text-red-500 fill-current hover:text-gray-400 transition-colors shadow-sm"
                >
                  <div>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
