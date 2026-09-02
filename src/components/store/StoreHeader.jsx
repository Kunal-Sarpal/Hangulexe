import React, { useState, useRef, useEffect } from 'react';
import { navigate } from '../../hooks/useRouter';
import Icons from '../Icons';
import CustomerLoginModal from './CustomerLoginModal';
import ManageAddressesModal from './ManageAddressesModal';

export default function StoreHeader({ user, setUser, handleLogout, likesCount = 0, cartItemCount = 0 }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const profileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(prev => !prev)}
                  className="text-xs font-bold tracking-wider text-[#1C1B19] border border-[#E6E2DA] rounded-full w-8 h-8 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 hover:border-[#1C1B19] transition-colors cursor-pointer select-none"
                  aria-expanded={profileDropdownOpen}
                  aria-label="User profile"
                >
                  {user.initials || 'ME'}
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-md border border-gray-100 py-1 z-50 animate-fade-in">
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-xs font-bold text-gray-800 truncate">{user.name}</div>
                      {user.email && <div className="text-[11px] text-gray-500 truncate mt-0.5">{user.email}</div>}
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F5F3ED] text-[#1C1B19] uppercase tracking-wider">
                        {user.role || 'Customer'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button 
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setShowAddressModal(true);
                        }} 
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Saved Addresses</span>
                      </button>

                      {user.role !== 'Customer' && (
                        <button 
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            navigate('/admin');
                          }} 
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button 
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }} 
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 rounded-b-md flex items-center gap-2 cursor-pointer font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
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

      {/* Address Management Modal */}
      {showAddressModal && (
        <ManageAddressesModal 
          isOpen={showAddressModal} 
          onClose={() => setShowAddressModal(false)} 
          user={user} 
          setUser={setUser} 
        />
      )}

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

            {/* Mobile User Profile & Logout section */}
            {user ? (
              <div className="mt-auto pt-6 border-t border-[#E6E2DA]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold tracking-wider text-[#1C1B19] border border-[#E6E2DA] rounded-full w-9 h-9 flex items-center justify-center bg-white shadow-sm">
                    {user.initials || 'ME'}
                  </span>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#1C1B19] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#6E6A63] truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowAddressModal(true);
                    }}
                    className="text-left text-xs font-semibold py-2 text-[#1C1B19] hover:opacity-75 flex items-center gap-2 cursor-pointer"
                  >
                    <span>📍</span> Saved Addresses
                  </button>
                  {user.role !== 'Customer' && (
                    <button 
                      onClick={() => {
                        setShowMobileMenu(false);
                        navigate('/admin');
                      }}
                      className="text-left text-xs font-semibold py-2 text-[#1C1B19] hover:opacity-75 flex items-center gap-2 cursor-pointer"
                    >
                      <span>⚙️</span> Admin Dashboard
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setShowMobileMenu(false);
                      handleLogout();
                    }}
                    className="text-left text-xs font-bold py-2 text-red-600 hover:text-red-700 flex items-center gap-2 cursor-pointer mt-1"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-auto pt-6 border-t border-[#E6E2DA]">
                <button 
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowLogin(true);
                  }}
                  className="w-full bg-[#1C1B19] text-[#FAF9F6] text-xs font-bold tracking-widest py-3 uppercase text-center cursor-pointer hover:opacity-90"
                >
                  Log In / Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
