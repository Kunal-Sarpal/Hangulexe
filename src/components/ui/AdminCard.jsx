import React from 'react';

/**
 * Reusable Admin Card component as specified by user:
 * w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none relative px-4 pt-4 pb-3 md:px-5 md:pt-4.5 md:pb-3.5 min-h-[100px] transition-all duration-300 flex flex-col gap-2.5 cursor-pointer
 */
export const AdminCard = ({ children, className = '', onClick, ...props }) => (
  <div 
    onClick={onClick}
    className={`w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none relative px-4 pt-4 pb-3 md:px-5 md:pt-4.5 md:pb-3.5 transition-all duration-300 flex flex-col gap-2.5 ${onClick ? 'cursor-pointer hover:border-zinc-400' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const AdminStatCard = ({ label, value, subtext, icon, onClick, className = '' }) => (
  <div 
    onClick={onClick}
    className={`w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none relative px-4 pt-4 pb-3 md:px-5 md:pt-4.5 md:pb-3.5 min-h-[100px] transition-all duration-300 flex flex-col justify-between cursor-pointer hover:border-zinc-400 group ${className}`}
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{label}</span>
      {icon && <span className="text-zinc-400 text-sm group-hover:text-zinc-700 transition-colors">{icon}</span>}
    </div>
    <div className="my-1">
      <span className="text-2xl font-black text-zinc-900 tracking-tight font-machina">{value}</span>
    </div>
    {subtext && (
      <div className="text-[11px] text-zinc-500 font-medium truncate">
        {subtext}
      </div>
    )}
  </div>
);

export default AdminCard;
