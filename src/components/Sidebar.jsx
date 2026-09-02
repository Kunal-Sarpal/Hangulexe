import React from 'react';
import Icons from './Icons';
import { SIDEBAR_ITEMS } from '../data/constants';

const Sidebar = ({ role, currentPage, navigateTo, sidebarOpen, setSidebarOpen, onLogout, user }) => {
  const sidebarItems = SIDEBAR_ITEMS[role] || [];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Group items in Gentelella fashion
  const generalIds = ['dashboard', 'analytics'];
  const manageIds = ['inventory', 'orders', 'staff', 'walkin', 'design'];
  
  const generalItems = sidebarItems.filter(item => generalIds.includes(item.id));
  const manageItems = sidebarItems.filter(item => manageIds.includes(item.id));
  const otherItems = sidebarItems.filter(item => !generalIds.includes(item.id) && !manageIds.includes(item.id));

  const renderNavGroup = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4">
        {sidebarOpen && (
          <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            {title}
          </h3>
        )}
        <div className="space-y-0.5">
          {items.map((item) => {
            const Icon = Icons[item.icon];
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                title={item.label}
                className={`flex items-center transition-all duration-150 relative cursor-pointer ${
                  !sidebarOpen
                    ? 'justify-center mx-auto w-11 h-11 rounded-lg my-1 ' + (isActive ? 'bg-white text-zinc-900 shadow-md font-bold' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white')
                    : 'w-full gap-3 px-4 py-2.5 text-xs font-semibold ' + (isActive ? 'bg-zinc-800 text-white border-r-4 border-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80')
                }`}
              >
                <span className={`shrink-0 ${isActive && sidebarOpen ? 'text-white' : ''}`}>
                  {Icon && <Icon />}
                </span>
                {sidebarOpen && <span className="truncate tracking-wide">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside
      className="shrink-0 z-30 flex flex-col h-full bg-[#18181B] text-white transition-all duration-200 select-none"
      style={{ width: sidebarOpen ? '230px' : '70px', borderRight: '1px solid #27272A' }}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#27272A] bg-[#121215]">
        {sidebarOpen ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-white text-zinc-900 flex items-center justify-center text-xs font-black shadow-xs">
              H
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white truncate">
              Admin <span className="text-zinc-400">Dashboard</span>
            </span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-7 h-7 rounded-lg bg-white text-zinc-900 flex items-center justify-center text-xs font-black">
              H
            </div>
          </div>
        )}
      </div>

      {/* User Profile Info */}
      {sidebarOpen && (
        <div className="p-4 border-b border-[#27272A] flex items-center gap-3 bg-[#1C1C20]">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full bg-zinc-800 text-white flex items-center justify-center text-sm font-bold shadow-sm border border-zinc-700">
              {user ? (user.initials || user.name?.slice(0, 2).toUpperCase() || 'AD') : 'AD'}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-zinc-400 rounded-full border-2 border-[#18181B]" title="Active" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] text-zinc-400 leading-none mb-1 font-medium">Welcome,</p>
            <p className="text-[13px] font-bold text-white truncate leading-tight">
              {user ? user.name : 'Admin User'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-3 overflow-y-auto custom-scrollbar">
        {generalItems.length > 0 ? (
          <>
            {renderNavGroup('General', generalItems)}
            {renderNavGroup('Management', manageItems)}
            {renderNavGroup('Administration', otherItems)}
          </>
        ) : (
          renderNavGroup('Navigation', sidebarItems)
        )}
      </nav>

      {/* 4 Footer Icons */}
      <div className="h-12 border-t border-[#27272A] bg-[#121215] flex items-center justify-around shrink-0 px-1">
        <button
          onClick={() => navigateTo('settings')}
          title="Settings"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
        >
          <Icons.Settings className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <button
          onClick={() => window.open('/', '_blank')}
          title="View Storefront"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
        >
          <Icons.Eye className="w-4 h-4" />
        </button>
        <button
          onClick={onLogout}
          title="Logout"
          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
        >
          <Icons.Logout className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
