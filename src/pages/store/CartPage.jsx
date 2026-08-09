import React, { useState, useEffect } from 'react';
import { useRouter } from '../../hooks/useRouter';
import Icons from '../../components/Icons';
import CheckoutModal from '../../components/store/CheckoutModal';
import CustomerLoginModal from '../../components/store/CustomerLoginModal';

export default function CartPage({ cart, setCart, user, setUser }) {
  const { navigate } = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Derive cart details by merging cart state with fetched products
  const cartItems = cart.map(item => {
    const productDetail = products.find(p => p._id === item.productId);
    return {
      ...item,
      product: productDetail
    };
  }).filter(item => item.product); // only show if product loaded

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!cart || cart.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const uniqueIds = [...new Set(cart.map(c => c.productId))];
        const url = `/api/store/products?ids=${uniqueIds.join(',')}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Server status: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Fetch cart products error:', err);
      }
      setLoading(false);
    };

    fetchCartProducts();
  }, [cart]);

  const updateQuantity = (productId, size, change) => {
    setCart(prev => {
      const newCart = prev.map(item => {
        if (item.productId === productId && item.size === size) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      localStorage.setItem('hanguluxe_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeItem = (productId, size) => {
    setCart(prev => {
      const newCart = prev.filter(item => !(item.productId === productId && item.size === size));
      localStorage.setItem('hanguluxe_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  const totalMrp = cartItems.reduce((sum, item) => sum + (item.product.mrp * item.quantity), 0);
  const discount = totalMrp - subtotal;
  const shipping = subtotal > 1500 ? 0 : 100;
  const total = subtotal + shipping;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <div className="text-xs text-gray-500 mb-2 cursor-pointer hover:text-gray-900" onClick={() => navigate('/')}>
            Home &gt; Shopping Bag
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Bag <span className="text-sm font-normal text-gray-500 ml-2">— {cart.reduce((a,b)=>a+b.quantity,0)} Items</span>
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">Loading your bag...</div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-gray-300 mb-4 bg-gray-50 p-6 rounded-full">
            <Icons.Bag />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't made your choice yet.</p>
          <button 
            onClick={() => navigate('/men')}
            className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-lg shadow-sm hover:bg-yellow-500 transition-colors uppercase tracking-wider"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Cart Items */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item, idx) => (
              <div key={`${item.productId}-${item.size}-${idx}`} className="flex gap-6 p-4 bg-white border border-gray-100 rounded-xl shadow-sm relative group">
                
                {/* Remove button */}
                <button 
                  onClick={() => removeItem(item.productId, item.size)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <span className="text-xl leading-none">&times;</span>
                </button>

                <div 
                  className="w-28 shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <img src={item.product.image_url} alt={item.product.product_name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">FASHIONCO®</h3>
                    <h2 
                      className="text-lg font-bold text-gray-900 leading-tight mb-2 pr-8 cursor-pointer hover:underline"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {item.product.product_name}
                    </h2>
                    
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <span className="text-gray-500">Size: <span className="font-bold text-gray-900">{item.size}</span></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.size, -1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      >-</button>
                      <span className="px-3 py-1 font-bold text-sm min-w-[40px] text-center border-x border-gray-300">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.size, 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                      >+</button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-xl font-black text-gray-900">₹{item.product.sellingPrice * item.quantity}</div>
                      {item.product.mrp > item.product.sellingPrice && (
                        <div className="text-xs text-gray-400 line-through">₹{item.product.mrp * item.quantity}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Order Summary</h3>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{totalMrp}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-gray-900">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
              </div>

              <hr className="border-gray-200 mb-6" />

              <div className="flex justify-between items-end mb-8">
                <span className="text-gray-900 font-bold uppercase tracking-wider">Total</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-gray-900">₹{total}</span>
                  <p className="text-[10px] text-gray-500 mt-1">inclusive of all taxes</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!user) {
                    setShowLoginModal(true);
                  } else {
                    setShowCheckoutModal(true);
                  }
                }}
                className="w-full bg-[#1C1B19] text-[#FAF9F6] font-bold text-xs tracking-widest py-4 hover:opacity-90 transition-opacity uppercase cursor-pointer"
              >
                Checkout with UPI QR
              </button>
            </div>
          </div>

        </div>
      )}

      {/* UPI QR Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cartItems={cartItems}
        totalAmount={total}
        user={user}
        onOrderSuccess={(orderNum) => {
          setCart([]);
          localStorage.removeItem('hanguluxe_cart');
        }}
      />

      {/* Customer Login/Signup Modal */}
      {showLoginModal && (
        <CustomerLoginModal 
          onClose={() => setShowLoginModal(false)} 
          setUser={setUser} 
        />
      )}
    </div>
  );
}
