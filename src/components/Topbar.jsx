import React, { useState, useRef, useEffect } from 'react';
import { navigate } from '../hooks/useRouter';

const Topbar = ({ user, rc, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <h1 className="text-[16px] font-bold text-[#111827] tracking-tight">Fashion Co Admin</h1>
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${rc.light} ${rc.text} ${rc.border}`}>
          {user.role}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="w-9 h-9 rounded-[10px] hover:bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-all relative cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-[#EF4444] rounded-full border border-white" />
        </button>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className={`w-9 h-9 rounded-[10px] bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white text-[11px] font-bold`} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {user.initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-[13px] font-bold text-[#111827] leading-none">{user.name}</p>
              <p className="text-[11px] text-[#6B7280] mt-1 leading-none">{user.email}</p>
            </div>
            <svg className="w-3.5 h-3.5 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border border-gray-100 py-1.5 z-50 animate-fade-in">
              <div className="px-3.5 py-2 border-b border-gray-100 sm:hidden">
                <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/');
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer font-medium"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                View Storefront
              </button>

              {onLogout && (
                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
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
