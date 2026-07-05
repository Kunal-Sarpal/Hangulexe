// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export const formatCurrency = (num) => `₹${num.toLocaleString('en-IN')}`;

export const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (['active', 'in stock', 'completed', 'present', 'confirmed', 'approved', 'delivered', 'paid', 'published'].includes(s)) {
    return { bg: 'bg-[#ECFDF5]', text: 'text-[#047857]', border: 'border-[#D1FAE5]', dot: 'bg-[#10B981]' };
  }
  if (['low stock', 'pending', 'processing', 'in store', 'under review', 'in progress', 'new', 'shipped'].includes(s)) {
    return { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FEF3C7]', dot: 'bg-[#F59E0B]' };
  }
  if (['out of stock', 'expired', 'absent', 'cancelled', 'rejected', 'returned', 'refunded'].includes(s)) {
    return { bg: 'bg-[#FEF2F2]', text: 'text-[#B91C1C]', border: 'border-[#FEE2E2]', dot: 'bg-[#EF4444]' };
  }
  return { bg: 'bg-[#F9FAFB]', text: 'text-[#374151]', border: 'border-[#E5E7EB]', dot: 'bg-[#9CA3AF]' };
};

export function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
