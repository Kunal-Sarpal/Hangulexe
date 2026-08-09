import React, { useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import Icons from '../Icons';
import CustomerLoginModal from './CustomerLoginModal';

export default function StoreHeader({ user, setUser, handleLogout, likesCount = 0, cartItemCount = 0 }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E6E2DA] z-40 flex items-center px-4 md:px-12 justify-between">
        {/* Left Section: Menu Toggle */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="text-[#1C1B19] hover:opacity-75 cursor-pointer" 
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          {/* Nav Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider text-[#6E6A63]">
            <button onClick={() => navigate('/men')} className="hover:text-[#1C1B19] transition-colors uppercase">MEN</button>
            <button onClick={() => navigate('/women')} className="hover:text-[#1C1B19] transition-colors uppercase">WOMEN</button>
            <button onClick={() => navigate('/accessories')} className="hover:text-[#1C1B19] transition-colors uppercase">ACCESSORIES</button>
          </nav>
        </div>

        {/* Center Section: Centered Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center justify-center select-none text-center"
        >
          <span className="font-display text-2xl md:text-3xl font-black tracking-[0.2em] text-[#1C1B19]">HANGULUXE</span>
          <span className="text-[8px] md:text-[10px] font-sans tracking-[0.4em] uppercase text-[#6E6A63] mt-0.5">STORIES WORTH WEARING</span>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="hidden md:flex items-center bg-[#F5F3ED] rounded-full px-4 py-1.5 w-48 border border-[#E6E2DA]">
            <Icons.Search className="text-[#6E6A63] w-4 h-4 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent text-xs w-full outline-none text-[#1C1B19]" 
            />
          </div>

          <div className="flex items-center gap-5 pl-2">
            {/* Search Toggle for Mobile */}
            <button className="md:hidden text-[#1C1B19] hover:opacity-75">
              <Icons.Search className="w-5 h-5" />
            </button>

            {/* Wishlist/Likes */}
            <div onClick={() => navigate('/likes')} className="relative cursor-pointer text-[#1C1B19] hover:opacity-75">
              <Icons.Heart className="w-5 h-5" />
              {likesCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                  {likesCount}
                </span>
              )}
            </div>

            {/* Profile */}
            {user ? (
              <div className="relative group cursor-pointer">
                <span className="text-xs font-bold tracking-wider text-[#1C1B19] border border-[#E6E2DA] rounded-full w-8 h-8 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50">{user.initials || 'ME'}</span>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md hidden group-hover:block border border-gray-100">
                  <div className="p-3 border-b border-gray-100 text-xs font-semibold text-gray-700">{user.name}</div>
                  {user.role !== 'Customer' && (
                    <button onClick={() => navigate('/admin')} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Admin Dashboard</button>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50 rounded-b-md">Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-[#1C1B19] hover:opacity-75 text-xs font-bold tracking-wider">LOGIN</button>
            )}

            {/* Cart/Bag */}
            <div onClick={() => navigate('/cart')} className="relative cursor-pointer text-[#1C1B19] hover:opacity-75">
              {/* Bag icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#1C1B19] text-[#FAF9F6] text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLogin && <CustomerLoginModal onClose={() => setShowLogin(false)} setUser={setUser} />}

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setShowMobileMenu(false)} 
            className="fixed inset-0 bg-black/45 backdrop-blur-sm" 
          />
          {/* Drawer body */}
          <div className="relative flex flex-col w-64 max-w-xs bg-[#FAF9F6] border-r border-[#E6E2DA] h-full p-6 shadow-2xl relative z-10">
            <button 
              onClick={() => setShowMobileMenu(false)} 
              className="absolute top-4 right-4 text-2xl font-light text-[#6E6A63] hover:text-[#1C1B19] cursor-pointer"
            >
              &times;
            </button>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#6E6A63] uppercase mb-8 block mt-2">HANGULUXE</span>
            <nav className="flex flex-col gap-6 text-sm font-bold tracking-wider text-[#1C1B19]">
              <button 
                onClick={() => { navigate('/men'); setShowMobileMenu(false); }} 
                className="text-left py-2 hover:opacity-75 uppercase cursor-pointer"
              >
                MEN
              </button>
              <button 
                onClick={() => { navigate('/women'); setShowMobileMenu(false); }} 
                className="text-left py-2 hover:opacity-75 uppercase cursor-pointer"
              >
                WOMEN
              </button>
              <button 
                onClick={() => { navigate('/accessories'); setShowMobileMenu(false); }} 
                className="text-left py-2 hover:opacity-75 uppercase cursor-pointer"
              >
                ACCESSORIES
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
