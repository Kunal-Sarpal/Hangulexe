import React, { useState, useRef, useEffect } from 'react';
import { navigate } from '../hooks/useRouter';
import Icons from './Icons';

const Topbar = ({ user, rc, onLogout, sidebarOpen, setSidebarOpen, navigateTo }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-[#EDEDED] border-b border-[#D9DEE4] px-4 flex items-center justify-between z-20 shrink-0">
      
      {/* Left: Sidebar Hamburger Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 rounded-lg hover:bg-black/5 flex items-center justify-center text-[#5A738E] hover:text-[#2A3F54] transition-all cursor-pointer"
          title="Toggle Navigation"
        >
          <Icons.Menu />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Admin Panel
          </span>
          <span className="text-[#C4C4C4]">/</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
            {user?.role || 'Manager'}
          </span>
        </div>
      </div>

      {/* Right: Quick actions, notifications, user dropdown */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* View Storefront Shortcut */}
        <button
          onClick={() => window.open('/', '_blank')}
          className="cursor-pointer group relative hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 bg-black bg-opacity-90 text-[#f1f1f1] rounded-full hover:bg-opacity-75 transition-all font-semibold shadow-md active:scale-95 text-xs"
          title="Open live storefront in new tab"
        >
          <Icons.Eye className="w-3.5 h-3.5" />
          <span>Live Store</span>
        </button>

        {/* Message Envelope Icon */}
        <button
          onClick={() => setNotifOpen(prev => !prev)}
          className="w-9 h-9 rounded-lg hover:bg-black/5 flex items-center justify-center text-zinc-600 hover:text-zinc-900 relative cursor-pointer transition-colors"
          title="Messages"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-zinc-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            3
          </span>
        </button>

        {/* Notification Bell Icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(prev => !prev)}
            className="w-9 h-9 rounded-lg hover:bg-black/5 flex items-center justify-center text-zinc-600 hover:text-zinc-900 relative cursor-pointer transition-colors"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-zinc-900 rounded-full border border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-lg border border-zinc-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Notifications</span>
                <span className="text-[10px] bg-zinc-100 text-zinc-700 font-bold px-1.5 py-0.5 rounded">3 New</span>
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="font-semibold text-gray-900">New customer order received</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">2 minutes ago</p>
                </div>
                <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="font-semibold text-gray-900">Low stock warning on 3 items</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-2.5 p-1 px-2 rounded-lg hover:bg-white/80 transition-all cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {user?.initials || 'AD'}
            </div>
            <span className="hidden sm:block text-xs font-bold text-zinc-800">
              {user?.name || 'Admin'}
            </span>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white shadow-xl rounded-lg border border-[#D9DEE4] py-1.5 z-50 animate-fade-in text-xs">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  if (navigateTo) navigateTo('settings');
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer font-medium"
              >
                <Icons.Settings className="w-4 h-4 text-gray-400" />
                Settings & Preferences
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  window.open('/', '_blank');
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer font-medium"
              >
                <Icons.Eye className="w-4 h-4 text-gray-400" />
                View Live Storefront
              </button>

              {onLogout && (
                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <Icons.Logout className="w-4 h-4 text-red-500" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Topbar;
