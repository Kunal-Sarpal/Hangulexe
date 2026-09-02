import React from 'react';

// Iconify 'material-symbols:check-circle-outline-rounded' / Lucide check-circle
export const StatusCheckIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// Iconify 'material-symbols:schedule-outline-rounded' / Lucide clock
export const StatusClockIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Iconify 'material-symbols:cancel-outline-rounded' / Lucide x-circle
export const StatusXIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const StatusBadge = ({ status, className = "" }) => {
  const s = String(status || '').toLowerCase().trim();

  // Completed / Delivered / Paid / Active / Present / In Stock
  if (['completed', 'delivered', 'paid', 'active', 'present', 'confirmed', 'in stock', 'instock', 'approved', 'published'].includes(s)) {
    const label = s === 'instock' ? 'In Stock' : status;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A86B] select-none ${className}`}>
        <StatusCheckIcon className="w-4 h-4 shrink-0 text-[#00A86B]" />
        <span>{label}</span>
      </span>
    );
  }

  // In Progress / Pending / Processing / Low Stock / Shipped
  if (['pending', 'in progress', 'inprogress', 'processing', 'low stock', 'lowstock', 'under review', 'on duty', 'shipped'].includes(s)) {
    const label = s === 'pending' ? 'In Progress' : (s === 'lowstock' ? 'Low Stock' : status);
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B] select-none ${className}`}>
        <StatusClockIcon className="w-4 h-4 shrink-0 text-[#F59E0B]" />
        <span>{label}</span>
      </span>
    );
  }

  // Cancelled / Out of Stock / Expired / Rejected
  if (['cancelled', 'out of stock', 'outofstock', 'expired', 'rejected', 'failed', 'refunded', 'absent'].includes(s)) {
    const label = s === 'outofstock' ? 'Out of Stock' : status;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] select-none ${className}`}>
        <StatusXIcon className="w-4 h-4 shrink-0 text-[#EF4444]" />
        <span>{label}</span>
      </span>
    );
  }

  // Default fallback
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 select-none ${className}`}>
      <span className="w-2 h-2 rounded-full bg-zinc-400" />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
