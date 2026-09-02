// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export const formatCurrency = (num) => `₹${num.toLocaleString('en-IN')}`;

export const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (['active', 'in stock', 'completed', 'present', 'confirmed', 'approved', 'delivered', 'paid', 'published'].includes(s)) {
    return { bg: 'bg-emerald-50', text: 'text-[#00A86B]', border: 'border-emerald-200', dot: 'bg-[#00A86B]' };
  }
  if (['low stock', 'pending', 'processing', 'in store', 'under review', 'in progress', 'new', 'shipped'].includes(s)) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
  }
  if (['out of stock', 'expired', 'absent', 'cancelled', 'rejected', 'returned', 'refunded'].includes(s)) {
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' };
  }
  return { bg: 'bg-zinc-100', text: 'text-zinc-700', border: 'border-zinc-200', dot: 'bg-zinc-500' };
};

export function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
