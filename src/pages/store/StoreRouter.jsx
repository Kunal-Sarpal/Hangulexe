import React from 'react';
import { useRouter } from '../../hooks/useRouter';
import { useAnalytics } from '../../hooks/useAnalytics';
import LandingPage from './LandingPage';
import ProductListingPage from './ProductListingPage';
import ProductDetailPage from './ProductDetailPage';
import LikesPage from './LikesPage';
import CartPage from './CartPage';
import StoreHeader from '../../components/store/StoreHeader';

export default function StoreRouter({ user, setUser, handleLogout, showToast }) {
  const { path } = useRouter();

  const [likes, setLikes] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hanguluxe_likes')) || [];
    } catch {
      return [];
    }
  });

  const toggleLike = (productId) => {
    setLikes(prev => {
      const newLikes = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('hanguluxe_likes', JSON.stringify(newLikes));
      if (!prev.includes(productId) && showToast) {
        showToast('Added to Wishlist!', 'success');
      }
      return newLikes;
    });
  };

  const [cart, setCart] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hanguluxe_cart')) || [];
    } catch {
      return [];
    }
  });

  const addToCart = (productId, size, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId && item.size === size);
      let newCart;
      if (existing) {
        newCart = prev.map(item => 
          item.productId === productId && item.size === size 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        newCart = [...prev, { productId, size, quantity }];
      }
      localStorage.setItem('hanguluxe_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  // Very basic routing based on path prefix
  let content = null;
  if (path === '/' || path === '') {
    content = <ProductListingPage categoryPath="all" likes={likes} toggleLike={toggleLike} />;
  } else if (path.startsWith('/men') || path.startsWith('/women') || path.startsWith('/accessories')) {
    content = <ProductListingPage categoryPath={path.replace('/', '')} likes={likes} toggleLike={toggleLike} />;
  } else if (path.startsWith('/product/')) {
    const productId = path.split('/')[2];
    content = <ProductDetailPage productId={productId} showToast={showToast} likes={likes} toggleLike={toggleLike} addToCart={addToCart} />;
  } else if (path.startsWith('/likes')) {
    content = <LikesPage likes={likes} toggleLike={toggleLike} />;
  } else if (path.startsWith('/cart')) {
    content = <CartPage cart={cart} setCart={setCart} user={user} setUser={setUser} />;
  } else {
    content = <div className="p-20 text-center text-2xl font-bold">404 Not Found</div>;
  }

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <StoreHeader user={user} setUser={setUser} handleLogout={handleLogout} likesCount={likes.length} cartItemCount={cartItemCount} />
      <div className="flex-1 pt-20">
        {content}
      </div>
    </div>
  );
}
