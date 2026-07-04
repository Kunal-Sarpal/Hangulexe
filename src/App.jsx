import { useState, useEffect, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════
// DUMMY DATA
// ═══════════════════════════════════════════════════════════

const USERS = {
  'manager@fashionco.com': { name: 'Vikram Joshi', role: 'Manager', initials: 'VJ' },
  'reception@fashionco.com': { name: 'Neha Patel', role: 'Receptionist', initials: 'NP' },
  'designer@fashionco.com': { name: 'Priya Sharma', role: 'Designer', initials: 'PS' },
  'partner@fashionco.com': { name: 'Rajesh Sharma', role: 'Partner', initials: 'RS' },
};

const ROLE_COLORS = {
  Manager: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200', accent: '#3b82f6', gradient: 'from-blue-500 to-blue-600', accentHex: '#3b82f6', lightHex: '#dbeafe' },
  Receptionist: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', accent: '#22c55e', gradient: 'from-emerald-500 to-emerald-600', accentHex: '#22c55e', lightHex: '#dcfce7' },
  Designer: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200', accent: '#a855f7', gradient: 'from-purple-500 to-purple-600', accentHex: '#a855f7', lightHex: '#f3e8ff' },
  Partner: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200', accent: '#f59e0b', gradient: 'from-amber-500 to-amber-600', accentHex: '#f59e0b', lightHex: '#fef3c7' },
};

const INVENTORY = [
  { sku: 'SKU-001', name: 'Classic White Kurta', category: 'Ethnic Wear', model: 'KW-2024', designer: 'Priya Sharma', vendor: 'Sharma Textiles', mrp: 1299, costPrice: 480, purchasePrice: 520, sellingPrice: 999, stock: 145, sold: 312, status: 'In Stock', shelf: 'A1' },
  { sku: 'SKU-002', name: 'Slim Fit Chinos', category: 'Casuals', model: 'SF-CHN', designer: 'Rahul Verma', vendor: 'Delhi Fabrics', mrp: 2499, costPrice: 890, purchasePrice: 950, sellingPrice: 1999, stock: 23, sold: 189, status: 'Low Stock', shelf: 'A2' },
  { sku: 'SKU-003', name: 'Floral Maxi Dress', category: 'Western', model: 'FMD-23', designer: 'Anita Singh', vendor: 'Mumbai Mills', mrp: 3199, costPrice: 1100, purchasePrice: 1200, sellingPrice: 2499, stock: 0, sold: 421, status: 'Out of Stock', shelf: 'A3' },
  { sku: 'SKU-004', name: 'Denim Jacket', category: 'Casuals', model: 'DJ-BLK', designer: 'Rahul Verma', vendor: 'Jaipur Jeans Co', mrp: 4999, costPrice: 1800, purchasePrice: 1950, sellingPrice: 3999, stock: 67, sold: 98, status: 'In Stock', shelf: 'B1' },
  { sku: 'SKU-005', name: 'Embroidered Lehenga', category: 'Ethnic Wear', model: 'EL-RED', designer: 'Meena Kapoor', vendor: 'Surat Silks', mrp: 12999, costPrice: 4500, purchasePrice: 4800, sellingPrice: 10999, stock: 8, sold: 34, status: 'Low Stock', shelf: 'B2' },
  { sku: 'SKU-006', name: 'Cotton Polo T-Shirt', category: 'Casualwear', model: 'CPT-WHT', designer: 'Priya Sharma', vendor: 'Tirupur Knits', mrp: 899, costPrice: 280, purchasePrice: 310, sellingPrice: 699, stock: 320, sold: 870, status: 'In Stock', shelf: 'B3' },
  { sku: 'SKU-007', name: 'Formal Blazer', category: 'Formals', model: 'FB-NVY', designer: 'Arjun Mehta', vendor: 'Kolkata Weavers', mrp: 7499, costPrice: 2600, purchasePrice: 2800, sellingPrice: 5999, stock: 15, sold: 56, status: 'In Stock', shelf: 'C1' },
  { sku: 'SKU-008', name: 'Palazzo Pants', category: 'Fusion', model: 'PP-PNK', designer: 'Anita Singh', vendor: 'Ahmedabad Fabrics', mrp: 1799, costPrice: 600, purchasePrice: 650, sellingPrice: 1399, stock: 0, sold: 203, status: 'Out of Stock', shelf: 'C2' },
  { sku: 'SKU-009', name: 'Silk Saree', category: 'Ethnic Wear', model: 'SS-GLD', designer: 'Meena Kapoor', vendor: 'Varanasi Silks', mrp: 8999, costPrice: 3200, purchasePrice: 3400, sellingPrice: 7499, stock: 42, sold: 156, status: 'In Stock', shelf: 'C3' },
  { sku: 'SKU-010', name: 'Printed Kurti', category: 'Ethnic Wear', model: 'PK-BLU', designer: 'Priya Sharma', vendor: 'Jaipur Prints', mrp: 1599, costPrice: 520, purchasePrice: 560, sellingPrice: 1199, stock: 88, sold: 445, status: 'In Stock', shelf: 'D1' },
];

const COUPONS = [
  { code: 'WELCOME20', type: '% Off', value: '20%', minOrder: 500, validFrom: '01 Jan 2025', validTo: '31 Mar 2025', usage: 234, status: 'Active' },
  { code: 'FLAT100', type: 'Flat Off', value: '₹100', minOrder: 999, validFrom: '15 Jan 2025', validTo: '28 Feb 2025', usage: 89, status: 'Expired' },
  { code: 'SUMMER30', type: '% Off', value: '30%', minOrder: 1500, validFrom: '01 Mar 2025', validTo: '31 May 2025', usage: 12, status: 'Active' },
  { code: 'BOGO-ETHNIC', type: 'BOGO', value: 'Buy 1 Get 1', minOrder: 2000, validFrom: '10 Feb 2025', validTo: '10 Mar 2025', usage: 5, status: 'Active' },
  { code: 'FESTIVE15', type: '% Off', value: '15%', minOrder: 1000, validFrom: '01 Oct 2024', validTo: '31 Dec 2024', usage: 567, status: 'Expired' },
  { code: 'NEWUSER50', type: 'Flat Off', value: '₹50', minOrder: 499, validFrom: '01 Jun 2025', validTo: '30 Jun 2025', usage: 0, status: 'Active' },
];

const STAFF = [
  { name: 'Neha Patel', id: 'EMP-101', phone: '+91 98765 43210', email: 'neha@fashionco.com', shift: 'Morning (9AM - 5PM)', checkIn: '08:55 AM', status: 'Present' },
  { name: 'Ravi Kumar', id: 'EMP-102', phone: '+91 87654 32109', email: 'ravi@fashionco.com', shift: 'Evening (2PM - 10PM)', checkIn: '01:52 PM', status: 'Present' },
  { name: 'Sunita Devi', id: 'EMP-103', phone: '+91 76543 21098', email: 'sunita@fashionco.com', shift: 'Morning (9AM - 5PM)', checkIn: '—', status: 'Absent' },
  { name: 'Amit Tiwari', id: 'EMP-104', phone: '+91 65432 10987', email: 'amit@fashionco.com', shift: 'Full Day (10AM - 8PM)', checkIn: '09:58 AM', status: 'Present' },
];

const WALKINS = [
  { id: 'VIS-001', customer: 'Anjali Mehta', phone: '+91 98100 23456', purpose: 'Browse', timeIn: '10:15 AM', timeOut: '11:30 AM', attendedBy: 'Neha Patel', status: 'Completed' },
  { id: 'VIS-002', customer: 'Karan Singh', phone: '+91 99887 76655', purpose: 'Fitting', timeIn: '11:00 AM', timeOut: '—', attendedBy: 'Ravi Kumar', status: 'In Store' },
  { id: 'VIS-003', customer: 'Priya Nair', phone: '+91 88776 65544', purpose: 'Pickup', timeIn: '11:45 AM', timeOut: '12:05 PM', attendedBy: 'Neha Patel', status: 'Completed' },
  { id: 'VIS-004', customer: 'Deepak Gupta', phone: '+91 77665 54433', purpose: 'Return', timeIn: '12:30 PM', timeOut: '—', attendedBy: 'Amit Tiwari', status: 'In Store' },
  { id: 'VIS-005', customer: 'Simran Kaur', phone: '+91 66554 43322', purpose: 'Browse', timeIn: '01:00 PM', timeOut: '02:15 PM', attendedBy: 'Ravi Kumar', status: 'Completed' },
  { id: 'VIS-006', customer: 'Mohit Jain', phone: '+91 55443 32211', purpose: 'Fitting', timeIn: '02:30 PM', timeOut: '—', attendedBy: 'Neha Patel', status: 'In Store' },
];

const APPOINTMENTS = [
  { time: '10:00 AM', customer: 'Sonia Gupta', service: 'Bridal Lehenga Fitting', status: 'Confirmed' },
  { time: '11:30 AM', customer: 'Rahul Sharma', service: 'Blazer Alteration', status: 'Pending' },
  { time: '2:00 PM', customer: 'Priya Nair', service: 'Saree Draping', status: 'Confirmed' },
  { time: '3:30 PM', customer: 'Mehul Desai', service: 'Kids Wear Pickup', status: 'Cancelled' },
  { time: '4:30 PM', customer: 'Anita Reddy', service: 'Custom Blouse Fitting', status: 'Confirmed' },
  { time: '5:00 PM', customer: 'Vikash Patel', service: 'Suit Measurement', status: 'Pending' },
];

const RETURNS = [
  { id: 'RET-001', orderId: 'FC-2024-0856', customer: 'Meera Shah', item: 'Slim Fit Chinos', reason: 'Size mismatch', requestedOn: '15 Jun 2025', status: 'Pending' },
  { id: 'RET-002', orderId: 'FC-2024-0823', customer: 'Arjun Kapoor', item: 'Cotton Polo T-Shirt', reason: 'Color faded after wash', requestedOn: '14 Jun 2025', status: 'Approved' },
  { id: 'RET-003', orderId: 'FC-2024-0801', customer: 'Divya Nair', item: 'Floral Maxi Dress', reason: 'Defective stitching', requestedOn: '13 Jun 2025', status: 'Rejected' },
  { id: 'RET-004', orderId: 'FC-2024-0878', customer: 'Rohit Malhotra', item: 'Formal Blazer', reason: 'Wrong item delivered', requestedOn: '16 Jun 2025', status: 'Pending' },
];

const DESIGNS = [
  { name: 'Floral Maxi 2025', collection: 'Summer Collection', season: 'SS25', status: 'Published', products: 3, color: '#ec4899' },
  { name: 'Ethnic Geometric', collection: 'Festive', season: 'AW24', status: 'Published', products: 2, color: '#f97316' },
  { name: 'Pastel Stripes', collection: 'Casuals', season: 'SS25', status: 'Under Review', products: 0, color: '#a78bfa' },
  { name: 'Embroidery Block', collection: 'Heritage', season: 'AW24', status: 'Draft', products: 0, color: '#fb923c' },
  { name: 'Boho Print', collection: 'Fusion', season: 'SS25', status: 'Published', products: 5, color: '#34d399' },
  { name: 'Minimalist Linen', collection: 'Formals', season: 'SS25', status: 'Published', products: 4, color: '#60a5fa' },
];

const MOOD_BOARD = [
  { type: 'color', color: '#E8D5B7', label: 'Warm Sand', hex: '#E8D5B7' },
  { type: 'color', color: '#8B4513', label: 'Saddle Brown', hex: '#8B4513' },
  { type: 'note', text: 'Earth tones for SS25 — raw, organic, grounded', color: '#fef3c7' },
  { type: 'fabric', text: 'Raw Silk Texture\nMatte finish, light weave', color: '#fce7f3' },
  { type: 'color', color: '#2D5016', label: 'Forest Green', hex: '#2D5016' },
  { type: 'note', text: 'Inspiration: Rajasthani block prints with modern minimalism', color: '#dbeafe' },
  { type: 'fabric', text: 'Organic Cotton\nSoft hand feel, breathable', color: '#dcfce7' },
  { type: 'color', color: '#C4A882', label: 'Desert Gold', hex: '#C4A882' },
];

const OFFLINE_SALES = [
  { bill: 'BILL-4501', date: '27 Jun 2025', customer: 'Ananya Mehta', items: 3, total: 4297, payment: 'UPI', gst: true, status: 'Completed' },
  { bill: 'BILL-4502', date: '27 Jun 2025', customer: 'Ravi Shankar', items: 1, total: 2499, payment: 'Card', gst: true, status: 'Completed' },
  { bill: 'BILL-4503', date: '26 Jun 2025', customer: 'Pooja Verma', items: 2, total: 1698, payment: 'Cash', gst: false, status: 'Completed' },
  { bill: 'BILL-4504', date: '26 Jun 2025', customer: 'Suresh Gupta', items: 5, total: 8795, payment: 'Card', gst: true, status: 'Completed' },
  { bill: 'BILL-4505', date: '25 Jun 2025', customer: 'Lakshmi Iyer', items: 1, total: 10999, payment: 'UPI', gst: true, status: 'Refunded' },
  { bill: 'BILL-4506', date: '25 Jun 2025', customer: 'Manish Agarwal', items: 4, total: 5596, payment: 'Cash', gst: true, status: 'Completed' },
];

const ONLINE_SALES = [
  { orderId: 'ONL-7801', platform: 'Own Site', date: '27 Jun 2025', items: 2, revenue: 3498, commission: 0, netPayout: 3498, status: 'Delivered' },
  { orderId: 'ONL-7802', platform: 'Amazon', date: '27 Jun 2025', items: 1, revenue: 5999, commission: 900, netPayout: 5099, status: 'Shipped' },
  { orderId: 'ONL-7803', platform: 'Flipkart', date: '26 Jun 2025', items: 3, revenue: 4197, commission: 630, netPayout: 3567, status: 'Delivered' },
  { orderId: 'ONL-7804', platform: 'Meesho', date: '26 Jun 2025', items: 1, revenue: 1399, commission: 280, netPayout: 1119, status: 'Processing' },
  { orderId: 'ONL-7805', platform: 'Amazon', date: '25 Jun 2025', items: 2, revenue: 7998, commission: 1200, netPayout: 6798, status: 'Delivered' },
  { orderId: 'ONL-7806', platform: 'Own Site', date: '25 Jun 2025', items: 1, revenue: 2499, commission: 0, netPayout: 2499, status: 'Returned' },
];

const SETTLEMENTS = [
  { id: 'STL-2025-06', period: '01-15 Jun 2025', gross: 245000, returns: 12500, commission: 18200, tds: 2450, net: 211850, status: 'Paid' },
  { id: 'STL-2025-05B', period: '16-31 May 2025', gross: 312000, returns: 8900, commission: 23400, tds: 3120, net: 276580, status: 'Paid' },
  { id: 'STL-2025-05A', period: '01-15 May 2025', gross: 198000, returns: 5600, commission: 14850, tds: 1980, net: 175570, status: 'Processing' },
  { id: 'STL-2025-06B', period: '16-30 Jun 2025', gross: 287000, returns: 15200, commission: 21500, tds: 2870, net: 247430, status: 'Pending' },
];

const GST_DATA = [
  { month: 'Jan 2025', taxable: 485000, cgst: 43650, sgst: 43650, igst: 0, total: 87300, filed: true },
  { month: 'Feb 2025', taxable: 523000, cgst: 47070, sgst: 47070, igst: 12500, total: 106640, filed: true },
  { month: 'Mar 2025', taxable: 612000, cgst: 55080, sgst: 55080, igst: 8200, total: 118360, filed: true },
  { month: 'Apr 2025', taxable: 478000, cgst: 43020, sgst: 43020, igst: 5600, total: 91640, filed: true },
  { month: 'May 2025', taxable: 556000, cgst: 50040, sgst: 50040, igst: 9800, total: 109880, filed: false },
  { month: 'Jun 2025', taxable: 389000, cgst: 35010, sgst: 35010, igst: 3200, total: 73220, filed: false },
];

const MONTHLY_REVENUE = [
  { month: 'Jan', value: 485000 },
  { month: 'Feb', value: 523000 },
  { month: 'Mar', value: 612000 },
  { month: 'Apr', value: 478000 },
  { month: 'May', value: 556000 },
  { month: 'Jun', value: 389000 },
];

const SHELF_LAYOUT = [
  ['A1', 'A2', 'A3', 'A4'],
  ['B1', 'B2', 'B3', 'B4'],
  ['C1', 'C2', 'C3', 'C4'],
  ['D1', 'D2', 'D3', 'D4'],
];

const DESIGN_REQUESTS = [
  { id: 'DR-001', title: 'Festive Kurta Print', requester: 'Manager', priority: 'High', deadline: '15 Jul 2025', status: 'New', description: 'Need traditional block print design for Diwali collection kurtas. Should incorporate gold and maroon tones.' },
  { id: 'DR-002', title: 'Summer Casual T-Shirt Graphics', requester: 'Partner', priority: 'Medium', deadline: '20 Jul 2025', status: 'In Progress', description: 'Modern graphic designs for youth casual t-shirt line. Minimal, trendy patterns.' },
  { id: 'DR-003', title: 'Kids Wear Prints', requester: 'Manager', priority: 'Low', deadline: '01 Aug 2025', status: 'New', description: 'Fun, colorful prints for kids wear collection ages 4-12. Animal and nature themes.' },
];

// ═══════════════════════════════════════════════════════════
// ICON COMPONENTS (inline SVG icons)
// ═══════════════════════════════════════════════════════════

const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Inventory: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Orders: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  Staff: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Coupon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>,
  Reports: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Walkin: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Return: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>,
  Feedback: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Log: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Design: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Upload: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Collection: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Link: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  MoodBoard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
  Request: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
  Business: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Sale: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Online: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Settlement: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>,
  GST: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Layout: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  ChevronLeft: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Copy: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EmptyBox: () => <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
};

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

const formatCurrency = (num) => `₹${num.toLocaleString('en-IN')}`;

const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (['active', 'in stock', 'completed', 'present', 'confirmed', 'approved', 'delivered', 'paid', 'published'].includes(s)) return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };
  if (['low stock', 'pending', 'processing', 'in store', 'under review', 'in progress', 'new', 'shipped'].includes(s)) return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
  if (['out of stock', 'expired', 'absent', 'cancelled', 'rejected', 'returned', 'refunded'].includes(s)) return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
  if (['draft'].includes(s)) return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
  return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
};

// ═══════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════

const StatusBadge = ({ status }) => {
  const colors = getStatusColor(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide ${colors.bg} ${colors.text}`} style={{ letterSpacing: '0.02em' }}>
      <span className={`w-[6px] h-[6px] rounded-full ${colors.dot}`} style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
      {status}
    </span>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="stat-card">
    <div className="stat-card-content">
      <span className="stat-card-label">{title}</span>
      <span className="stat-card-value">{value}</span>
      {trend && <span className="stat-card-subtext">{trend}</span>}
    </div>
    <div className={`stat-card-icon-box bg-gradient-to-br ${color} text-white`}>
      {icon}
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children, width = 'max-w-lg' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" style={{ transition: 'opacity 0.2s' }} />
      <div className={`relative bg-white rounded-3xl ${width} w-full max-h-[85vh] overflow-y-auto animate-scale-in`} style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)' }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl border-b border-slate-100 px-7 py-5 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all hover:rotate-90 duration-200">
            <Icons.Close />
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
      </div>
    </div>
  );
};

const Toast = ({ message, visible, type = 'success' }) => {
  if (!visible) return null;
  const colors = type === 'success' ? 'from-emerald-500 to-emerald-600' : type === 'error' ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600';
  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-toast-in">
      <div className={`bg-gradient-to-r ${colors} text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 text-[13px] font-semibold tracking-wide`} style={{ boxShadow: '0 20px 40px -8px rgba(0,0,0,0.25)' }}>
        {type === 'success' && <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"><Icons.Check /></span>}
        {message}
      </div>
    </div>
  );
};

const EmptyState = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
    <div className="animate-float w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5"><Icons.EmptyBox /></div>
    <h3 className="text-base font-bold text-slate-500 tracking-tight">{title}</h3>
    <p className="mt-1.5 text-sm text-slate-400 max-w-xs text-center leading-relaxed">{subtitle}</p>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-2 pt-5 mt-2 border-t border-slate-100">
      <p className="text-[12px] text-slate-400 font-medium">Page {currentPage} of {totalPages}</p>
      <div className="flex items-center gap-1.5">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
          <Icons.ChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => onPageChange(i + 1)} className={`w-9 h-9 rounded-xl text-[12px] font-semibold transition-all duration-200 ${currentPage === i + 1 ? 'bg-slate-900 text-white shadow-lg shadow-slate-400/20' : 'text-slate-500 hover:bg-slate-100'}`}>
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
          <Icons.ChevronRight />
        </button>
      </div>
    </div>
  );
};

const TableWrapper = ({ children }) => (
  <div className="overflow-x-auto rounded-2xl border border-slate-200/50 card-shadow">
    <table className="w-full text-[13px]">{children}</table>
  </div>
);

const Th = ({ children, className = '' }) => (
  <th className={`px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/90 first:rounded-tl-2xl last:rounded-tr-2xl ${className}`} style={{ letterSpacing: '0.08em' }}>{children}</th>
);

const Td = ({ children, className = '' }) => (
  <td className={`px-5 py-4 text-[13px] text-slate-600 border-t border-slate-100/80 ${className}`}>{children}</td>
);

const FormField = ({ label, children }) => (
  <div className="space-y-2">
    <label className="block text-[13px] font-semibold text-slate-500 tracking-wide" style={{ letterSpacing: '0.02em' }}>{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.06)] transition-all placeholder:text-slate-300 placeholder:font-normal";
const btnPrimary = "px-6 py-3 rounded-xl bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 transition-all active:scale-[0.97] tracking-wide" + " shadow-[0_4px_14px_-3px_rgba(15,23,42,0.3)]";
const btnSecondary = "px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.97]";

const Breadcrumb = ({ onClick, label = 'Back' }) => (
  <button onClick={onClick} className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-slate-700 mb-6 group transition-all">
    <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
      <Icons.ChevronLeft />
    </span>
    <span className="group-hover:underline underline-offset-2">{label}</span>
  </button>
);

// ═══════════════════════════════════════════════════════════
// SVG CHARTS
// ═══════════════════════════════════════════════════════════

const BarChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value));
  const barWidth = 40;
  const gap = 16;
  const chartHeight = 160;
  const svgWidth = data.length * (barWidth + gap) + gap;
  return (
    <svg width="100%" viewBox={`0 0 ${svgWidth} ${chartHeight + 45}`} className="overflow-visible">
      {data.map((d, i) => {
        const h = (d.value / maxVal) * chartHeight;
        const x = gap + i * (barWidth + gap);
        return (
          <g key={i}>
            <defs>
              <linearGradient id={`bar-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--text-accent)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.25)" />
              </linearGradient>
            </defs>
            {/* Background bar track */}
            <rect x={x} y={0} width={barWidth} height={chartHeight} rx={6} fill="rgba(0,0,0,0.02)" />
            {/* Main animated bar */}
            <rect x={x} y={chartHeight - h} width={barWidth} height={h} rx={6} fill={`url(#bar-${i})`}>
              <animate attributeName="height" from="0" to={h} dur="0.6s" fill="freeze" />
              <animate attributeName="y" from={chartHeight} to={chartHeight - h} dur="0.6s" fill="freeze" />
            </rect>
            {/* Month label below bars */}
            <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" style={{ fontSize: '12px', fill: 'var(--text-secondary)', fontWeight: 400 }}>{d.month}</text>
            {/* Bar value label above bars */}
            <text x={x + barWidth / 2} y={chartHeight - h - 6} textAnchor="middle" style={{ fontSize: '13px', fill: 'var(--text-primary)', fontWeight: 500 }}>{`₹${(d.value / 1000).toFixed(0)}K`}</text>
          </g>
        );
      })}
    </svg>
  );
};

const DonutChart = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = [
    'var(--text-accent, #3b82f6)',
    '#8b5cf6',
    '#f59e0b',
    '#22c55e',
    '#ef4444',
    '#ec4899',
    '#14b8a6'
  ];
  let cumulative = 0;
  const radius = 70;
  const cx = 90;
  const cy = 90;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <svg width="180" height="180" viewBox="0 0 180 180" className="flex-shrink-0">
        {data.map((d, i) => {
          const startAngle = (cumulative / total) * 360;
          cumulative += d.value;
          const endAngle = (cumulative / total) * 360;
          const start = polarToCartesian(cx, cy, radius, startAngle);
          const end = polarToCartesian(cx, cy, radius, endAngle);
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;
          const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
          return (
            <path
              key={i}
              d={path}
              fill={colors[i % colors.length]}
              opacity={0.9}
              className="hover:opacity-100 transition-opacity cursor-pointer"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={44} fill="var(--surface-1)" />
        <text x={cx} y={cy + 2} textAnchor="middle" className="donut-center-number" fill="var(--text-primary)">{total}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" className="donut-center-label" fill="var(--text-secondary)">Total Items</text>
      </svg>
      <div className="flex-1 w-full space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="donut-legend-item">
            <div className="donut-legend-dot" style={{ backgroundColor: colors[i % colors.length] }} />
            <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ═══════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Manager');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const user = USERS[email];
      if (user) {
        onLogin({ ...user, email });
      } else {
        setError('Invalid credentials. Try manager@fashionco.com');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-screen-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="login-card">
          <div className="login-title-wrapper">
            <div className="login-logo">
              FC
            </div>
            <h1 className="login-title">Fashion Co</h1>
            <p className="login-subtitle">Admin Panel — Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field-group">
              <label className="login-label">Email</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="Enter your email" className="login-input" required />
            </div>

            <div className="login-field-group">
              <label className="login-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="login-input" required />
            </div>

            <div className="login-field-group">
              <label className="login-label">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="login-select">
                <option value="Manager">Manager</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Designer">Designer</option>
                <option value="Partner">Partner</option>
              </select>
            </div>

            {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">Demo accounts: manager@ · reception@ · designer@ · partner@fashionco.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SIDEBAR NAVIGATION
// ═══════════════════════════════════════════════════════════

const SIDEBAR_ITEMS = {
  Manager: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'inventory', label: 'Inventory', icon: 'Inventory' },
    { id: 'layout', label: 'Inventory Layout', icon: 'Layout' },
    { id: 'orders', label: 'Orders', icon: 'Orders' },
    { id: 'staff', label: 'Staff', icon: 'Staff' },
    { id: 'coupons', label: 'Coupons', icon: 'Coupon' },
    { id: 'reports', label: 'Reports', icon: 'Reports' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ],
  Receptionist: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'walkins', label: 'Walk-in Customers', icon: 'Walkin' },
    { id: 'appointments', label: 'Appointments', icon: 'Calendar' },
    { id: 'orderLookup', label: 'Order Lookup', icon: 'Search' },
    { id: 'returns', label: 'Returns & Exchanges', icon: 'Return' },
    { id: 'feedback', label: 'Customer Feedback', icon: 'Feedback' },
    { id: 'dailyLog', label: 'Daily Log', icon: 'Log' },
  ],
  Designer: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'myDesigns', label: 'My Designs', icon: 'Design' },
    { id: 'uploadDesign', label: 'Upload Design', icon: 'Upload' },
    { id: 'collections', label: 'Design Collections', icon: 'Collection' },
    { id: 'linkedProducts', label: 'Linked Products', icon: 'Link' },
    { id: 'moodBoard', label: 'Mood Board', icon: 'MoodBoard' },
    { id: 'designRequests', label: 'Design Requests', icon: 'Request' },
  ],
  Partner: [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'businessProfile', label: 'Business Profile', icon: 'Business' },
    { id: 'partnerInventory', label: 'Inventory', icon: 'Inventory' },
    { id: 'offlineSales', label: 'Offline Sales', icon: 'Sale' },
    { id: 'onlineSales', label: 'Online Sales', icon: 'Online' },
    { id: 'settlements', label: 'Settlements', icon: 'Settlement' },
    { id: 'gst', label: 'GST & Compliance', icon: 'GST' },
  ],
};

// ═══════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [modalState, setModalState] = useState({ type: null, data: null });

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, visible: true }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentPage('dashboard');
  }, []);

  if (!user) return <LoginScreen onLogin={setUser} />;

  const role = user.role;
  const rc = ROLE_COLORS[role];
  const sidebarItems = SIDEBAR_ITEMS[role] || [];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)', '--bg-accent': rc.lightHex, '--text-accent': rc.accentHex }}>
      {/* Sidebar */}
      <aside className="sidebar shrink-0 z-30" style={{ width: sidebarOpen ? '240px' : '76px', borderRight: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-6">
          {sidebarOpen && (
            <div className="animate-slide-in flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md">FC</div>
              <span className="font-bold text-slate-900 text-[15px] tracking-tight">Fashion Co</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
            <Icons.Menu />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {sidebarOpen && <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.12em] mb-3">Navigation</p>}
          {sidebarItems.map((item) => {
            const Icon = Icons[item.icon];
            const isActive = currentPage === item.id;
            return (
              <button key={item.id} onClick={() => navigateTo(item.id)} title={item.label} className={`sidebar-nav-item ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`}>
                <span className={`shrink-0`}>{Icon && <Icon />}</span>
                {sidebarOpen && <span className="animate-slide-in truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 pt-4 mt-auto">
          <button onClick={handleLogout} className={`sidebar-nav-item hover:bg-red-50 hover:text-red-600 ${!sidebarOpen ? 'justify-center px-0' : ''}`}>
            <Icons.Logout />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="topbar">
          <div className="flex items-center gap-4">
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Fashion Co Admin</h1>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${rc.light} ${rc.text} border ${rc.border}`} style={{ letterSpacing: '0.04em' }}>
              {role}
            </span>
          </div>
          <div className="flex items-center gap-5">
            {/* Notification bell */}
            <button className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all relative">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white text-[11px] font-bold`} style={{ boxShadow: '0 4px 12px -2px rgba(0,0,0,0.2)' }}>
                {user.initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-[13px] font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-400 -mt-0.5">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">
          <PageRouter role={role} page={currentPage} navigateTo={navigateTo} showToast={showToast} modalState={modalState} setModalState={setModalState} />
        </main>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3">
        {toasts.map(t => <Toast key={t.id} message={t.message} visible={t.visible} type={t.type} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE ROUTER
// ═══════════════════════════════════════════════════════════

const PageRouter = ({ role, page, navigateTo, showToast, modalState, setModalState }) => {
  switch (role) {
    case 'Manager':
      return <ManagerPages page={page} navigateTo={navigateTo} showToast={showToast} modalState={modalState} setModalState={setModalState} />;
    case 'Receptionist':
      return <ReceptionistPages page={page} navigateTo={navigateTo} showToast={showToast} />;
    case 'Designer':
      return <DesignerPages page={page} navigateTo={navigateTo} showToast={showToast} />;
    case 'Partner':
      return <PartnerPages page={page} navigateTo={navigateTo} showToast={showToast} />;
    default:
      return <EmptyState title="Unknown Role" subtitle="Please log in with a valid role" />;
  }
};

// ═══════════════════════════════════════════════════════════
// MANAGER PAGES
// ═══════════════════════════════════════════════════════════

const ManagerPages = ({ page, navigateTo, showToast, modalState, setModalState }) => {
  switch (page) {
    case 'dashboard': return <ManagerDashboard navigateTo={navigateTo} />;
    case 'inventory': return <ManagerInventory navigateTo={navigateTo} showToast={showToast} />;
    case 'layout': return <ManagerLayout navigateTo={navigateTo} />;
    case 'orders': return <ManagerOrders navigateTo={navigateTo} />;
    case 'staff': return <ManagerStaff navigateTo={navigateTo} />;
    case 'coupons': return <ManagerCoupons navigateTo={navigateTo} showToast={showToast} />;
    case 'reports': return <ManagerReports navigateTo={navigateTo} />;
    case 'settings': return <ManagerSettings navigateTo={navigateTo} showToast={showToast} />;
    default: return <ManagerDashboard navigateTo={navigateTo} />;
  }
};

const ManagerDashboard = ({ navigateTo }) => {
  const categoryData = useMemo(() => {
    const cats = {};
    INVENTORY.forEach(item => { cats[item.category] = (cats[item.category] || 0) + item.stock; });
    return Object.entries(cats).map(([label, value]) => ({ label, value }));
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="dashboard-title">Dashboard</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Welcome back — here's your store overview</p>
      </div>
      
      <div className="stat-card-grid">
        <StatCard title="Total Revenue" value="₹8,42,500" icon={<Icons.Sale />} color="from-blue-500 to-blue-600" trend="↑ 12.5% from last month" />
        <StatCard title="Orders Today" value="47" icon={<Icons.Orders />} color="from-emerald-500 to-emerald-600" trend="↑ 8 more than yesterday" />
        <StatCard title="Low Stock Items" value="12" icon={<Icons.Inventory />} color="from-amber-500 to-amber-600" />
        <StatCard title="Active Coupons" value="6" icon={<Icons.Coupon />} color="from-purple-500 to-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <div className="content-card-wrapper">
          <h3 className="section-heading revenue-chart-heading">Monthly Revenue</h3>
          <BarChart data={MONTHLY_REVENUE} />
        </div>
        <div className="content-card-wrapper">
          <h3 className="section-heading" style={{ marginBottom: '16px' }}>Category-wise Inventory</h3>
          <DonutChart data={categoryData} />
        </div>
      </div>

      <div className="content-card-wrapper">
        <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
          <h3 className="section-heading">Recent Orders</h3>
          <button onClick={() => navigateTo('orders')} className="hover:underline" style={{ fontSize: '13px', color: 'var(--text-accent)', background: 'none', border: 'none', padding: 0 }}>View All →</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'FC-2024-0892', customer: 'Ananya Mehta', items: 3, total: 4297, status: 'Delivered' },
                { id: 'FC-2024-0891', customer: 'Vikash Patel', items: 1, total: 2499, status: 'Shipped' },
                { id: 'FC-2024-0890', customer: 'Ritu Sharma', items: 2, total: 6998, status: 'Processing' },
                { id: 'FC-2024-0889', customer: 'Deepak Nair', items: 4, total: 8795, status: 'Delivered' },
                { id: 'FC-2024-0888', customer: 'Simran Kaur', items: 1, total: 999, status: 'Pending' },
              ].map((o, i) => (
                <tr key={i}>
                  <td>
                    <button onClick={() => navigateTo('orders')} className="order-id-link" style={{ background: 'none', border: 'none', padding: 0 }}>
                      {o.id}
                    </button>
                  </td>
                  <td>{o.customer}</td>
                  <td>{o.items}</td>
                  <td style={{ fontWeight: 500 }}>{formatCurrency(o.total)}</td>
                  <td>
                    <span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ManagerInventory = ({ navigateTo, showToast }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDesigner, setFilterDesigner] = useState('All');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const perPage = 6;

  const categories = useMemo(() => ['All', ...new Set(INVENTORY.map(i => i.category))], []);
  const designers = useMemo(() => ['All', ...new Set(INVENTORY.map(i => i.designer))], []);
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  const filtered = useMemo(() => {
    return INVENTORY.filter(item => {
      const matchSearch = !search || item.sku.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'All' || item.category === filterCategory;
      const matchStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchDesigner = filterDesigner === 'All' || item.designer === filterDesigner;
      return matchSearch && matchCat && matchStatus && matchDesigner;
    });
  }, [search, filterCategory, filterStatus, filterDesigner]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Inventory</h2>
          <p className="text-[13px] text-slate-400 mt-1 font-medium">{INVENTORY.length} products in catalog</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className={`${btnPrimary} flex items-center gap-2`}>
          <Icons.Plus /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-5 card-shadow">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"><Icons.Search /></span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by SKU or product name…" className={`${inputCls} pl-11`} />
          </div>
          <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }} className={inputCls + ' w-auto min-w-[140px]'}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className={inputCls + ' w-auto min-w-[130px]'}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterDesigner} onChange={e => { setFilterDesigner(e.target.value); setPage(1); }} className={inputCls + ' w-auto min-w-[140px]'}>
            {designers.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        {paged.length === 0 ? <EmptyState title="No products found" subtitle="Try adjusting your filters" /> : (
          <>
            <TableWrapper>
              <thead><tr>
                <Th>SKU</Th><Th>Product Name</Th><Th>Category</Th><Th>Designer</Th><Th>Vendor</Th><Th>MRP</Th><Th>Selling ₹</Th><Th>Stock</Th><Th>Sold</Th><Th>Status</Th>
              </tr></thead>
              <tbody>
                {paged.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <Td><span className="font-mono text-xs font-medium text-blue-600">{item.sku}</span></Td>
                    <Td><span className="font-medium text-slate-800">{item.name}</span></Td>
                    <Td>{item.category}</Td>
                    <Td>{item.designer}</Td>
                    <Td className="text-xs">{item.vendor}</Td>
                    <Td>{formatCurrency(item.mrp)}</Td>
                    <Td className="font-medium">{formatCurrency(item.sellingPrice)}</Td>
                    <Td><span className={`font-semibold ${item.stock === 0 ? 'text-red-500' : item.stock < 25 ? 'text-amber-500' : 'text-emerald-600'}`}>{item.stock}</span></Td>
                    <Td>{item.sold}</Td>
                    <Td><StatusBadge status={item.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product" width="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Product Name"><input className={inputCls} placeholder="e.g. Silk Kurta" /></FormField>
          <FormField label="SKU ID"><input className={inputCls} placeholder="SKU-XXX" /></FormField>
          <FormField label="Category">
            <select className={inputCls}>
              <option>Ethnic Wear</option><option>Casuals</option><option>Western</option><option>Formals</option><option>Fusion</option><option>Casualwear</option>
            </select>
          </FormField>
          <FormField label="Model"><input className={inputCls} placeholder="Model code" /></FormField>
          <FormField label="Designer"><input className={inputCls} placeholder="Designer name" /></FormField>
          <FormField label="Supplier/Vendor"><input className={inputCls} placeholder="Vendor name" /></FormField>
          <FormField label="MRP (₹)"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Cost Price (₹)"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Purchase Price (₹)"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Selling Price (₹)"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Stock Quantity"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <FormField label="Shelf Location"><input className={inputCls} placeholder="e.g. A1" /></FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowAddModal(false)} className={btnSecondary}>Cancel</button>
          <button onClick={() => { setShowAddModal(false); showToast('Product added successfully'); }} className={btnPrimary}>Add Product</button>
        </div>
      </Modal>
    </div>
  );
};

const ManagerLayout = ({ navigateTo }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const getProductForShelf = (shelfId) => INVENTORY.find(i => i.shelf === shelfId);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div>
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Inventory Layout</h2>
        <p className="text-[13px] text-slate-400 mt-1 font-medium">Visual floor/shelf layout — click a slot to view details</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
        <div className="grid gap-4">
          {SHELF_LAYOUT.map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-4">
              {row.map((slot) => {
                const product = getProductForShelf(slot);
                const isEmpty = !product;
                const statusColor = isEmpty ? 'border-dashed border-slate-200 bg-slate-50/50' :
                  product.stock === 0 ? 'border-red-200 bg-red-50/50' :
                  product.stock < 25 ? 'border-amber-200 bg-amber-50/50' :
                  'border-emerald-200 bg-emerald-50/50';
                return (
                  <button key={slot} onClick={() => setSelectedSlot(slot)} className={`p-4 rounded-xl border-2 ${statusColor} card-shadow hover:card-shadow-lg transition-all text-left group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-slate-800">{slot}</span>
                      {!isEmpty && <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-600' : product.stock < 25 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {product.stock} pcs
                      </span>}
                    </div>
                    {product ? (
                      <>
                        <p className="text-xs font-medium text-slate-700 truncate">{product.sku}</p>
                        <p className="text-[11px] text-slate-500 truncate">{product.name}</p>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Empty slot</p>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 rounded border-2 border-emerald-300 bg-emerald-50" /> In Stock</div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 rounded border-2 border-amber-300 bg-amber-50" /> Low Stock</div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 rounded border-2 border-red-300 bg-red-50" /> Out of Stock</div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 rounded border-2 border-dashed border-slate-300 bg-slate-50" /> Empty</div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedSlot} onClose={() => setSelectedSlot(null)} title={`Shelf ${selectedSlot}`}>
        {selectedSlot && (() => {
          const product = getProductForShelf(selectedSlot);
          if (!product) return <EmptyState title="Empty Shelf" subtitle="No product assigned to this location" />;
          return (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">SKU</span><p className="font-mono font-medium text-blue-600">{product.sku}</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Product</span><p className="font-medium">{product.name}</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Category</span><p>{product.category}</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Stock</span><p className="font-semibold">{product.stock} units</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Selling Price</span><p className="font-semibold">{formatCurrency(product.sellingPrice)}</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><span className="text-slate-500 text-xs">Status</span><div className="mt-1"><StatusBadge status={product.status} /></div></div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

const ManagerOrders = ({ navigateTo }) => {
  const [page, setPage] = useState(1);
  const orders = [
    { id: 'FC-2024-0892', customer: 'Ananya Mehta', phone: '+91 98100 23456', items: 3, total: 4297, date: '27 Jun 2025', payment: 'UPI', status: 'Delivered' },
    { id: 'FC-2024-0891', customer: 'Vikash Patel', phone: '+91 99887 76655', items: 1, total: 2499, date: '27 Jun 2025', payment: 'Card', status: 'Shipped' },
    { id: 'FC-2024-0890', customer: 'Ritu Sharma', phone: '+91 88776 65544', items: 2, total: 6998, date: '26 Jun 2025', payment: 'COD', status: 'Processing' },
    { id: 'FC-2024-0889', customer: 'Deepak Nair', phone: '+91 77665 54433', items: 4, total: 8795, date: '26 Jun 2025', payment: 'UPI', status: 'Delivered' },
    { id: 'FC-2024-0888', customer: 'Simran Kaur', phone: '+91 66554 43322', items: 1, total: 999, date: '25 Jun 2025', payment: 'Card', status: 'Pending' },
    { id: 'FC-2024-0887', customer: 'Manish Agarwal', phone: '+91 55443 32211', items: 2, total: 3498, date: '25 Jun 2025', payment: 'UPI', status: 'Delivered' },
    { id: 'FC-2024-0886', customer: 'Kavita Joshi', phone: '+91 44332 21100', items: 5, total: 12490, date: '24 Jun 2025', payment: 'Card', status: 'Delivered' },
    { id: 'FC-2024-0885', customer: 'Suresh Gupta', phone: '+91 33221 10099', items: 1, total: 5999, date: '24 Jun 2025', payment: 'COD', status: 'Returned' },
  ];
  const perPage = 6;
  const totalPages = Math.ceil(orders.length / perPage);
  const paged = orders.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Orders</h2>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Order ID</Th><Th>Customer</Th><Th>Date</Th><Th>Items</Th><Th>Total</Th><Th>Payment</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {paged.map((o, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td><span className="font-mono text-xs font-medium text-blue-600">{o.id}</span></Td>
                <Td><span className="font-medium">{o.customer}</span><br /><span className="text-xs text-slate-400">{o.phone}</span></Td>
                <Td>{o.date}</Td>
                <Td>{o.items}</Td>
                <Td className="font-medium">{formatCurrency(o.total)}</Td>
                <Td>{o.payment}</Td>
                <Td><StatusBadge status={o.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

const ManagerStaff = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Staff — Receptionists</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {STAFF.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/50 p-5 card-shadow hover:card-shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.status === 'Present' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-slate-300 to-slate-400'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
              {s.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{s.name}</h3>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{s.id}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                <div><span className="text-slate-400">Phone:</span> {s.phone}</div>
                <div><span className="text-slate-400">Email:</span> {s.email}</div>
                <div><span className="text-slate-400">Shift:</span> {s.shift}</div>
                <div><span className="text-slate-400">Check-in:</span> {s.checkIn}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ManagerCoupons = ({ navigateTo, showToast }) => {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const perPage = 5;
  const totalPages = Math.ceil(COUPONS.length / perPage);
  const paged = COUPONS.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Coupons & Promotions</h2>
        <button onClick={() => setShowModal(true)} className={`${btnPrimary} flex items-center gap-2`}><Icons.Plus /> Create Coupon</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Code</Th><Th>Type</Th><Th>Value</Th><Th>Min Order</Th><Th>Valid From</Th><Th>Valid To</Th><Th>Usage</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {paged.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td><span className="font-mono font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{c.code}</span></Td>
                <Td>{c.type}</Td>
                <Td className="font-medium">{c.value}</Td>
                <Td>{formatCurrency(c.minOrder)}</Td>
                <Td className="text-xs">{c.validFrom}</Td>
                <Td className="text-xs">{c.validTo}</Td>
                <Td>{c.usage}</Td>
                <Td><StatusBadge status={c.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Coupon">
        <div className="space-y-4">
          <FormField label="Coupon Code"><input className={inputCls} placeholder="e.g. SUMMER30" /></FormField>
          <FormField label="Discount Type">
            <select className={inputCls}><option>% Off</option><option>Flat Off</option><option>BOGO</option></select>
          </FormField>
          <FormField label="Value"><input className={inputCls} placeholder="e.g. 20% or ₹100" /></FormField>
          <FormField label="Minimum Order (₹)"><input type="number" className={inputCls} placeholder="0" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Valid From"><input type="date" className={inputCls} /></FormField>
            <FormField label="Valid To"><input type="date" className={inputCls} /></FormField>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className={btnSecondary}>Cancel</button>
          <button onClick={() => { setShowModal(false); showToast('Coupon created successfully'); }} className={btnPrimary}>Create Coupon</button>
        </div>
      </Modal>
    </div>
  );
};

const ManagerReports = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Reports</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { title: 'Sales Report', desc: 'Revenue breakdown by day, week, month', icon: <Icons.Reports />, color: 'from-blue-500 to-indigo-600' },
        { title: 'Inventory Report', desc: 'Stock levels, low stock alerts, movement', icon: <Icons.Inventory />, color: 'from-emerald-500 to-teal-600' },
        { title: 'Staff Performance', desc: 'Attendance, sales per receptionist', icon: <Icons.Staff />, color: 'from-purple-500 to-pink-600' },
        { title: 'Coupon Analysis', desc: 'Usage rates, revenue impact', icon: <Icons.Coupon />, color: 'from-amber-500 to-orange-600' },
        { title: 'Customer Insights', desc: 'Repeat customers, top spenders', icon: <Icons.Walkin />, color: 'from-pink-500 to-rose-600' },
        { title: 'GST Summary', desc: 'Tax collected, filed status', icon: <Icons.GST />, color: 'from-slate-600 to-slate-800' },
      ].map((r, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/50 p-5 hover:card-shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
            {r.icon}
          </div>
          <h3 className="font-bold text-slate-900">{r.title}</h3>
          <p className="text-xs text-slate-500 mt-1">{r.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const ManagerSettings = ({ navigateTo, showToast }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Settings</h2>
    <div className="max-w-2xl space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 space-y-4">
        <h3 className="font-bold text-slate-900">Store Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Store Name"><input className={inputCls} defaultValue="Fashion Co — Karol Bagh" /></FormField>
          <FormField label="Phone"><input className={inputCls} defaultValue="+91 11 2872 3456" /></FormField>
          <FormField label="Email"><input className={inputCls} defaultValue="info@fashionco.com" /></FormField>
          <FormField label="GSTIN"><input className={inputCls} defaultValue="07AAHCS1234A1Z5" /></FormField>
        </div>
        <FormField label="Address"><textarea className={inputCls + ' resize-none'} rows={2} defaultValue="45, Cloth Market, Karol Bagh, New Delhi — 110005" /></FormField>
        <div className="flex justify-end pt-2">
          <button onClick={() => showToast('Settings saved')} className={btnPrimary}>Save Changes</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 space-y-4">
        <h3 className="font-bold text-slate-900">Notifications</h3>
        {['Low stock alerts', 'New order notifications', 'Daily sales summary', 'Staff check-in alerts'].map((item, i) => (
          <label key={i} className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">{item}</span>
            <div className="relative">
              <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 peer-checked:bg-blue-500 rounded-full transition-colors cursor-pointer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-all peer-checked:after:translate-x-5" />
            </div>
          </label>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// RECEPTIONIST PAGES
// ═══════════════════════════════════════════════════════════

const ReceptionistPages = ({ page, navigateTo, showToast }) => {
  switch (page) {
    case 'dashboard': return <ReceptionistDashboard navigateTo={navigateTo} />;
    case 'walkins': return <ReceptionistWalkins navigateTo={navigateTo} />;
    case 'appointments': return <ReceptionistAppointments navigateTo={navigateTo} />;
    case 'orderLookup': return <ReceptionistOrderLookup navigateTo={navigateTo} />;
    case 'returns': return <ReceptionistReturns navigateTo={navigateTo} />;
    case 'feedback': return <ReceptionistFeedback navigateTo={navigateTo} showToast={showToast} />;
    case 'dailyLog': return <ReceptionistDailyLog navigateTo={navigateTo} />;
    default: return <ReceptionistDashboard navigateTo={navigateTo} />;
  }
};

const ReceptionistDashboard = ({ navigateTo }) => (
  <div className="space-y-7 animate-fade-in">
    <div>
      <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
      <p className="text-[14px] text-slate-400 mt-1.5 font-medium">Today's reception overview — 27 Jun 2025</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard title="Walk-ins Today" value="18" icon={<Icons.Walkin />} color="from-emerald-500 to-emerald-600" />
      <StatCard title="Pending Fittings" value="5" icon={<Icons.Calendar />} color="from-blue-500 to-blue-600" />
      <StatCard title="Returns Pending" value="3" icon={<Icons.Return />} color="from-amber-500 to-amber-600" />
      <StatCard title="Feedback Collected" value="11" icon={<Icons.Feedback />} color="from-purple-500 to-purple-600" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-bold text-slate-900">Today's Appointments</h3>
          <button onClick={() => navigateTo('appointments')} className="text-[13px] text-emerald-600 hover:text-emerald-700 font-semibold hover:underline underline-offset-2 transition-colors">View All →</button>
        </div>
        <div className="space-y-2.5">
          {APPOINTMENTS.slice(0, 4).map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors border border-transparent hover:border-slate-200/50">
              <div className="text-[13px] font-bold text-slate-800 w-[72px] shrink-0">{a.time}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-700 truncate">{a.customer}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{a.service}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-bold text-slate-900">Recent Walk-ins</h3>
          <button onClick={() => navigateTo('walkins')} className="text-[13px] text-emerald-600 hover:text-emerald-700 font-semibold hover:underline underline-offset-2 transition-colors">View All →</button>
        </div>
        <div className="space-y-2.5">
          {WALKINS.slice(0, 4).map((w, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors border border-transparent hover:border-slate-200/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[11px] font-bold" style={{ boxShadow: '0 4px 12px -3px rgba(34,197,94,0.35)' }}>
                {w.customer.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-700 truncate">{w.customer}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{w.purpose} • {w.timeIn}</p>
              </div>
              <StatusBadge status={w.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ReceptionistWalkins = ({ navigateTo }) => {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(WALKINS.length / perPage);
  const paged = WALKINS.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Walk-in Customers</h2>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Visit ID</Th><Th>Customer</Th><Th>Phone</Th><Th>Purpose</Th><Th>Time In</Th><Th>Time Out</Th><Th>Attended By</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {paged.map((w, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td><span className="font-mono text-xs font-medium text-emerald-600">{w.id}</span></Td>
                <Td className="font-medium">{w.customer}</Td>
                <Td className="text-xs">{w.phone}</Td>
                <Td><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${w.purpose === 'Browse' ? 'bg-blue-50 text-blue-600' : w.purpose === 'Fitting' ? 'bg-purple-50 text-purple-600' : w.purpose === 'Pickup' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{w.purpose}</span></Td>
                <Td>{w.timeIn}</Td>
                <Td>{w.timeOut}</Td>
                <Td>{w.attendedBy}</Td>
                <Td><StatusBadge status={w.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

const ReceptionistAppointments = ({ navigateTo }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div>
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Appointments & Fittings</h2>
        <p className="text-[13px] text-slate-400 mt-1 font-medium">{dateStr}</p>
      </div>
      <div className="space-y-3">
        {APPOINTMENTS.map((a, i) => {
          const statusColors = a.status === 'Confirmed' ? 'border-l-emerald-500 bg-emerald-50/30' : a.status === 'Pending' ? 'border-l-amber-500 bg-amber-50/30' : 'border-l-red-500 bg-red-50/30';
          return (
            <div key={i} className={`bg-white rounded-xl border border-slate-200/50 border-l-4 ${statusColors} p-5 card-shadow hover:card-shadow-lg transition-all animate-fade-in`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-slate-800 w-24">{a.time}</div>
                  <div>
                    <p className="font-bold text-slate-900">{a.customer}</p>
                    <p className="text-sm text-slate-500">{a.service}</p>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReceptionistOrderLookup = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    if (searchQuery.toLowerCase().includes('0892') || searchQuery.includes('98100')) {
      setResult({ id: 'FC-2024-0892', customer: 'Ananya Mehta', phone: '+91 98100 23456', items: [
        { name: 'Classic White Kurta', qty: 1, price: 999 },
        { name: 'Cotton Polo T-Shirt', qty: 2, price: 1398 },
        { name: 'Palazzo Pants', qty: 1, price: 1399 },
      ], total: 4297, payment: 'UPI', date: '27 Jun 2025', status: 'Out for Delivery' });
    } else {
      setResult('not_found');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Order Lookup</h2>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
        <div className="flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search by Order ID or Phone number…" className={`${inputCls} pl-10`} />
          </div>
          <button onClick={handleSearch} className={btnPrimary}>Search</button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Try: FC-2024-0892 or 98100</p>
      </div>

      {result && result !== 'not_found' && (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Order #{result.id}</h3>
              <p className="text-sm text-slate-500">{result.date} • {result.payment}</p>
            </div>
            <StatusBadge status={result.status} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400">Customer</p>
              <p className="font-medium text-slate-800">{result.customer}</p>
              <p className="text-xs text-slate-500">{result.phone}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400">Total Amount</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(result.total)}</p>
            </div>
          </div>
          <TableWrapper>
            <thead><tr><Th>Item</Th><Th>Qty</Th><Th>Price</Th></tr></thead>
            <tbody>
              {result.items.map((item, i) => (
                <tr key={i}><Td>{item.name}</Td><Td>{item.qty}</Td><Td className="font-medium">{formatCurrency(item.price)}</Td></tr>
              ))}
            </tbody>
          </TableWrapper>
        </div>
      )}

      {result === 'not_found' && <EmptyState title="No order found" subtitle="Try a different Order ID or phone number" />}
    </div>
  );
};

const ReceptionistReturns = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Returns & Exchanges</h2>
    <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
      <TableWrapper>
        <thead><tr>
          <Th>Return ID</Th><Th>Order ID</Th><Th>Customer</Th><Th>Item</Th><Th>Reason</Th><Th>Requested</Th><Th>Status</Th>
        </tr></thead>
        <tbody>
          {RETURNS.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <Td><span className="font-mono text-xs font-medium text-amber-600">{r.id}</span></Td>
              <Td><span className="font-mono text-xs">{r.orderId}</span></Td>
              <Td className="font-medium">{r.customer}</Td>
              <Td>{r.item}</Td>
              <Td className="text-xs">{r.reason}</Td>
              <Td className="text-xs">{r.requestedOn}</Td>
              <Td><StatusBadge status={r.status} /></Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </div>
  </div>
);

const ReceptionistFeedback = ({ navigateTo, showToast }) => {
  const feedbacks = [
    { customer: 'Anjali Mehta', rating: 5, comment: 'Amazing collection! The staff was very helpful with my bridal lehenga selection.', date: '27 Jun 2025' },
    { customer: 'Karan Singh', rating: 4, comment: 'Good variety of formals. Would love to see more slim-fit options.', date: '27 Jun 2025' },
    { customer: 'Priya Nair', rating: 5, comment: 'Quick pickup, everything was packed perfectly. Will visit again!', date: '26 Jun 2025' },
    { customer: 'Deepak Gupta', rating: 3, comment: 'The return process could be smoother. Had to wait for 20 minutes.', date: '26 Jun 2025' },
    { customer: 'Simran Kaur', rating: 4, comment: 'Loved the new summer collection. Great prices for the quality.', date: '25 Jun 2025' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Customer Feedback</h2>
      <div className="space-y-4">
        {feedbacks.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/50 p-5 card-shadow hover:card-shadow-lg transition-all animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {f.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{f.customer}</h3>
                  <p className="text-xs text-slate-400">{f.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, idx) => (
                  <svg key={idx} className={`w-4 h-4 ${idx < f.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{f.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReceptionistDailyLog = ({ navigateTo }) => {
  const logs = [
    { time: '09:00 AM', event: 'Store opened', type: 'system' },
    { time: '09:15 AM', event: 'Neha Patel checked in', type: 'staff' },
    { time: '10:15 AM', event: 'Walk-in: Anjali Mehta — Browse', type: 'walkin' },
    { time: '10:30 AM', event: 'Appointment: Sonia Gupta — Bridal Lehenga Fitting (Confirmed)', type: 'appointment' },
    { time: '11:00 AM', event: 'Walk-in: Karan Singh — Fitting', type: 'walkin' },
    { time: '11:30 AM', event: 'Appointment: Rahul Sharma — Blazer Alteration (Pending)', type: 'appointment' },
    { time: '12:30 PM', event: 'Return request: Deepak Gupta — Slim Fit Chinos', type: 'return' },
    { time: '01:52 PM', event: 'Ravi Kumar checked in', type: 'staff' },
    { time: '02:00 PM', event: 'Appointment: Priya Nair — Saree Draping (Confirmed)', type: 'appointment' },
    { time: '02:30 PM', event: 'Walk-in: Mohit Jain — Fitting', type: 'walkin' },
  ];

  const getLogColor = (type) => {
    switch (type) {
      case 'system': return 'bg-slate-500';
      case 'staff': return 'bg-blue-500';
      case 'walkin': return 'bg-emerald-500';
      case 'appointment': return 'bg-purple-500';
      case 'return': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Daily Log</h2>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-slate-200" />
          <div className="space-y-4">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 relative animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`w-[9px] h-[9px] rounded-full ${getLogColor(log.type)} mt-1.5 relative z-10 ring-4 ring-white`} />
                <div className="flex-1 pb-1">
                  <span className="text-xs font-semibold text-slate-400">{log.time}</span>
                  <p className="text-sm text-slate-700 mt-0.5">{log.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// DESIGNER PAGES
// ═══════════════════════════════════════════════════════════

const DesignerPages = ({ page, navigateTo, showToast }) => {
  switch (page) {
    case 'dashboard': return <DesignerDashboard navigateTo={navigateTo} />;
    case 'myDesigns': return <DesignerMyDesigns navigateTo={navigateTo} />;
    case 'uploadDesign': return <DesignerUploadDesign navigateTo={navigateTo} showToast={showToast} />;
    case 'collections': return <DesignerCollections navigateTo={navigateTo} />;
    case 'linkedProducts': return <DesignerLinkedProducts navigateTo={navigateTo} />;
    case 'moodBoard': return <DesignerMoodBoard navigateTo={navigateTo} />;
    case 'designRequests': return <DesignerRequests navigateTo={navigateTo} />;
    default: return <DesignerDashboard navigateTo={navigateTo} />;
  }
};

const DesignerDashboard = ({ navigateTo }) => (
  <div className="space-y-7 animate-fade-in">
    <div>
      <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
      <p className="text-[14px] text-slate-400 mt-1.5 font-medium">Your design studio overview</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard title="Designs Published" value="24" icon={<Icons.Design />} color="from-purple-500 to-purple-600" />
      <StatCard title="Pending Review" value="3" icon={<Icons.Log />} color="from-amber-500 to-amber-600" />
      <StatCard title="Products Using Designs" value="18" icon={<Icons.Link />} color="from-blue-500 to-blue-600" />
      <StatCard title="Most Sold Design" value={<span className="text-[18px]">"Floral Maxi"</span>} icon={<Icons.Design />} color="from-pink-500 to-pink-600" trend="421 units sold" />
    </div>
    <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-slate-900">Recent Designs</h3>
        <button onClick={() => navigateTo('myDesigns')} className="text-[13px] text-purple-600 hover:text-purple-700 font-semibold hover:underline underline-offset-2 transition-colors">View All →</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {DESIGNS.slice(0, 3).map((d, i) => (
          <div key={i} className="rounded-xl border border-slate-200/50 overflow-hidden card-shadow hover:card-shadow-lg transition-all group">
            <div className="h-28 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${d.color}22, ${d.color}44)` }}>
              <span className="text-lg font-bold" style={{ color: d.color }}>{d.name}</span>
            </div>
            <div className="p-3">
              <p className="text-xs text-slate-500">{d.collection} • {d.season}</p>
              <div className="flex items-center justify-between mt-2">
                <StatusBadge status={d.status} />
                <span className="text-xs text-slate-400">{d.products} products</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DesignerMyDesigns = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <div className="flex items-center justify-between">
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">My Designs</h2>
      <button onClick={() => navigateTo('uploadDesign')} className={`${btnPrimary} flex items-center gap-2`}><Icons.Plus /> New Design</button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {DESIGNS.map((d, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden hover:card-shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="h-40 flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${d.color}15, ${d.color}35)` }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 20% 30%, ${d.color}40 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${d.color}30 0%, transparent 50%)` }} />
            <span className="text-2xl font-bold relative z-10" style={{ color: d.color }}>{d.name}</span>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-900">{d.name}</span>
              <StatusBadge status={d.status} />
            </div>
            <p className="text-xs text-slate-500">{d.collection} • {d.season}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">{d.products} products linked</span>
              <button className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                <Icons.Eye /> View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DesignerUploadDesign = ({ navigateTo, showToast }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Upload Design</h2>
    <div className="bg-white rounded-2xl border border-slate-200/50 p-6 max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Design Name"><input className={inputCls} placeholder="e.g. Floral Summer Print" /></FormField>
        <FormField label="Collection">
          <select className={inputCls}>
            <option>Summer</option><option>Festive</option><option>Casual</option><option>Heritage</option><option>Fusion</option><option>Formals</option>
          </select>
        </FormField>
        <FormField label="Season">
          <select className={inputCls}><option>SS25</option><option>AW24</option><option>SS26</option></select>
        </FormField>
        <FormField label="Design Type">
          <select className={inputCls}><option>Print</option><option>Embroidery</option><option>Solid</option><option>Textured</option></select>
        </FormField>
        <FormField label="Target Category">
          <select className={inputCls}><option>Ethnic</option><option>Western</option><option>Casuals</option><option>Formals</option><option>Kids</option></select>
        </FormField>
        <FormField label="Tags"><input className={inputCls} placeholder="e.g. floral, summer, pastel" /></FormField>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-600 mb-1.5">Design File</label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Icons.Upload />
          </div>
          <p className="text-sm font-medium text-slate-700">Drop your design file here or <span className="text-purple-600">browse</span></p>
          <p className="text-xs text-slate-400 mt-1">PNG, AI, PDF up to 50MB</p>
        </div>
      </div>

      <div className="mt-4">
        <FormField label="Description">
          <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Describe the design concept, colors, patterns…" />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <button onClick={() => showToast('Design saved as draft')} className={btnSecondary}>Save as Draft</button>
        <button onClick={() => showToast('Design submitted for review')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-300/30 transition-all active:scale-[0.98]">Submit for Review</button>
      </div>
    </div>
  </div>
);

const DesignerCollections = ({ navigateTo }) => {
  const collections = [
    { name: 'Summer Collection', season: 'SS25', designs: 8, status: 'Active', color: '#f59e0b' },
    { name: 'Festive', season: 'AW24', designs: 5, status: 'Active', color: '#ef4444' },
    { name: 'Casuals', season: 'SS25', designs: 12, status: 'Active', color: '#22c55e' },
    { name: 'Heritage', season: 'AW24', designs: 3, status: 'Draft', color: '#8b5cf6' },
    { name: 'Fusion', season: 'SS25', designs: 6, status: 'Active', color: '#ec4899' },
    { name: 'Formals', season: 'SS25', designs: 4, status: 'Active', color: '#3b82f6' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Design Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {collections.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden card-shadow hover:card-shadow-lg transition-all duration-300 animate-fade-in cursor-pointer group" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="h-3" style={{ background: c.color }} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900">{c.name}</h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-xs text-slate-500">Season: {c.season}</p>
              <p className="text-sm font-medium text-slate-700 mt-3">{c.designs} designs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DesignerLinkedProducts = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Linked Products</h2>
    <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
      <TableWrapper>
        <thead><tr>
          <Th>Design</Th><Th>Product SKU</Th><Th>Product Name</Th><Th>Category</Th><Th>Sold</Th><Th>Status</Th>
        </tr></thead>
        <tbody>
          {[
            { design: 'Floral Maxi 2025', sku: 'SKU-003', name: 'Floral Maxi Dress', category: 'Western', sold: 421, status: 'Out of Stock' },
            { design: 'Boho Print', sku: 'SKU-008', name: 'Palazzo Pants', category: 'Fusion', sold: 203, status: 'Out of Stock' },
            { design: 'Minimalist Linen', sku: 'SKU-007', name: 'Formal Blazer', category: 'Formals', sold: 56, status: 'In Stock' },
            { design: 'Ethnic Geometric', sku: 'SKU-001', name: 'Classic White Kurta', category: 'Ethnic Wear', sold: 312, status: 'In Stock' },
            { design: 'Boho Print', sku: 'SKU-006', name: 'Cotton Polo T-Shirt', category: 'Casualwear', sold: 870, status: 'In Stock' },
          ].map((p, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <Td><span className="font-medium text-purple-600">{p.design}</span></Td>
              <Td><span className="font-mono text-xs">{p.sku}</span></Td>
              <Td className="font-medium">{p.name}</Td>
              <Td>{p.category}</Td>
              <Td>{p.sold}</Td>
              <Td><StatusBadge status={p.status} /></Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </div>
  </div>
);

const DesignerMoodBoard = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Mood Board</h2>
    <p className="text-sm text-slate-500">SS25 Inspiration — Earth Tones & Heritage</p>
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
      {MOOD_BOARD.map((tile, i) => {
        if (tile.type === 'color') {
          const heights = ['h-32', 'h-40', 'h-36', 'h-28'];
          return (
            <div key={i} className={`${heights[i % 4]} rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden break-inside-avoid animate-fade-in`} style={{ background: tile.color, animationDelay: `${i * 80}ms` }}>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
                <p className="text-white text-sm font-semibold">{tile.label}</p>
                <p className="text-white/70 text-xs font-mono">{tile.hex}</p>
              </div>
            </div>
          );
        }
        return (
          <div key={i} className="rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer break-inside-avoid animate-fade-in" style={{ background: tile.color, animationDelay: `${i * 80}ms` }}>
            <p className="text-sm font-medium text-slate-700 whitespace-pre-line">{tile.text}</p>
          </div>
        );
      })}
    </div>
  </div>
);

const DesignerRequests = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Design Requests</h2>
    <div className="space-y-4">
      {DESIGN_REQUESTS.map((req, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/50 p-5 card-shadow hover:card-shadow-lg transition-all animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">{req.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${req.priority === 'High' ? 'bg-red-50 text-red-600' : req.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{req.priority}</span>
              </div>
              <h3 className="font-bold text-slate-900 mt-1">{req.title}</h3>
            </div>
            <StatusBadge status={req.status} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{req.description}</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
            <span>From: {req.requester}</span>
            <span>Deadline: {req.deadline}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// PARTNER PAGES
// ═══════════════════════════════════════════════════════════

const PartnerPages = ({ page, navigateTo, showToast }) => {
  switch (page) {
    case 'dashboard': return <PartnerDashboard navigateTo={navigateTo} />;
    case 'businessProfile': return <PartnerBusinessProfile navigateTo={navigateTo} showToast={showToast} />;
    case 'partnerInventory': return <PartnerInventory navigateTo={navigateTo} />;
    case 'offlineSales': return <PartnerOfflineSales navigateTo={navigateTo} showToast={showToast} />;
    case 'onlineSales': return <PartnerOnlineSales navigateTo={navigateTo} />;
    case 'settlements': return <PartnerSettlements navigateTo={navigateTo} />;
    case 'gst': return <PartnerGST navigateTo={navigateTo} showToast={showToast} />;
    default: return <PartnerDashboard navigateTo={navigateTo} />;
  }
};

const PartnerDashboard = ({ navigateTo }) => {
  const totalOnline = ONLINE_SALES.reduce((s, o) => s + o.revenue, 0);
  const totalOffline = OFFLINE_SALES.reduce((s, o) => s + o.total, 0);
  const pendingSettlements = SETTLEMENTS.filter(s => s.status === 'Pending').reduce((sum, s) => sum + s.net, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-[13px] text-slate-400 mt-1.5 font-medium">Sharma Textiles Pvt. Ltd. — Partner Overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(totalOnline + totalOffline)} icon={<Icons.Sale />} color="from-amber-500 to-amber-600" />
        <StatCard title="Online Sales" value={formatCurrency(totalOnline)} icon={<Icons.Online />} color="from-blue-500 to-blue-600" />
        <StatCard title="Offline Sales" value={formatCurrency(totalOffline)} icon={<Icons.Sale />} color="from-emerald-500 to-emerald-600" />
        <StatCard title="Pending Payouts" value={formatCurrency(pendingSettlements)} icon={<Icons.Settlement />} color="from-purple-500 to-purple-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900">Recent Offline Sales</h3>
            <button onClick={() => navigateTo('offlineSales')} className="text-sm text-amber-600 hover:text-amber-700 font-medium">View All →</button>
          </div>
          <div className="space-y-3">
            {OFFLINE_SALES.slice(0, 4).map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
                <div>
                  <p className="text-sm font-medium text-slate-700">{s.customer}</p>
                  <p className="text-xs text-slate-400">{s.bill} • {s.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{formatCurrency(s.total)}</p>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/50 p-7 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900">Platform Breakdown</h3>
          </div>
          {(() => {
            const platforms = {};
            ONLINE_SALES.forEach(s => { platforms[s.platform] = (platforms[s.platform] || 0) + s.revenue; });
            const entries = Object.entries(platforms).sort((a, b) => b[1] - a[1]);
            const maxPlatform = entries[0]?.[1] || 1;
            return (
              <div className="space-y-4">
                {entries.map(([platform, revenue], i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700">{platform}</span>
                      <span className="text-slate-500">{formatCurrency(revenue)}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700" style={{ width: `${(revenue / maxPlatform) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

const PartnerBusinessProfile = ({ navigateTo, showToast }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Business Profile</h2>
    <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden max-w-3xl">
      <div className="h-3 bg-gradient-to-r from-amber-400 to-amber-600" />
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl font-bold shadow-xl">ST</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Sharma Textiles Pvt. Ltd.</h3>
              <p className="text-sm text-slate-500">Manufacturer + Distributor</p>
            </div>
          </div>
          <StatusBadge status="Active" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            ['Business Area / Zone', 'North Delhi — Karol Bagh'],
            ['TP Area', 'CP Zone 4'],
            ['GSTIN', '07AAHCS1234A1Z5'],
            ['PAN', 'AAHCS1234A'],
            ['Business Type', 'Manufacturer + Distributor'],
            ['Contact', '+91 98100 12345'],
            ['Account Manager', 'Vikram Joshi'],
            ['Partner Since', 'January 2022'],
          ].map(([label, value], i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-xs text-slate-400 mb-0.5">{label}</p>
              <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                {value}
                {label === 'GSTIN' && (
                  <button onClick={() => { navigator.clipboard.writeText(value); showToast('GSTIN copied!'); }} className="text-slate-400 hover:text-slate-600 transition-colors"><Icons.Copy /></button>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-slate-50 rounded-xl p-3.5">
          <p className="text-xs text-slate-400 mb-0.5">Registered Address</p>
          <p className="text-sm font-medium text-slate-800">45, Cloth Market, Karol Bagh, New Delhi — 110005</p>
        </div>
      </div>
    </div>
  </div>
);

const PartnerInventory = ({ navigateTo }) => {
  const [page, setPage] = useState(1);
  const perPage = 6;
  const totalPages = Math.ceil(INVENTORY.length / perPage);
  const paged = INVENTORY.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div>
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Inventory</h2>
        <p className="text-xs text-slate-400 mt-1">Read-only view — Contact manager for changes</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>SKU</Th><Th>Product</Th><Th>Category</Th><Th>MRP</Th><Th>Selling ₹</Th><Th>Stock</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {paged.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td><span className="font-mono text-xs font-medium text-blue-600">{item.sku}</span></Td>
                <Td className="font-medium">{item.name}</Td>
                <Td>{item.category}</Td>
                <Td>{formatCurrency(item.mrp)}</Td>
                <Td className="font-medium">{formatCurrency(item.sellingPrice)}</Td>
                <Td>{item.stock}</Td>
                <Td><StatusBadge status={item.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

const PartnerOfflineSales = ({ navigateTo, showToast }) => {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const perPage = 5;
  const totalPages = Math.ceil(OFFLINE_SALES.length / perPage);
  const paged = OFFLINE_SALES.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Offline Sales</h2>
        <button onClick={() => setShowModal(true)} className={`${btnPrimary} flex items-center gap-2`}><Icons.Plus /> Record Sale</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Bill No</Th><Th>Date</Th><Th>Customer</Th><Th>Items</Th><Th>Total</Th><Th>Payment</Th><Th>GST</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {paged.map((s, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td><span className="font-mono text-xs font-medium text-amber-600">{s.bill}</span></Td>
                <Td className="text-xs">{s.date}</Td>
                <Td className="font-medium">{s.customer}</Td>
                <Td>{s.items}</Td>
                <Td className="font-medium">{formatCurrency(s.total)}</Td>
                <Td><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.payment === 'Cash' ? 'bg-emerald-50 text-emerald-600' : s.payment === 'Card' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{s.payment}</span></Td>
                <Td>{s.gst ? <span className="text-emerald-600 font-medium text-xs">Applied</span> : <span className="text-slate-400 text-xs">No</span>}</Td>
                <Td><StatusBadge status={s.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record New Sale" width="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Customer Name"><input className={inputCls} placeholder="Enter customer name" /></FormField>
            <FormField label="Phone"><input className={inputCls} placeholder="+91" /></FormField>
          </div>
          <FormField label="Items">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`} placeholder="Item name" />
                <input className={`${inputCls} w-20`} placeholder="Qty" type="number" />
                <input className={`${inputCls} w-28`} placeholder="Price ₹" type="number" />
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">+ Add another item</button>
            </div>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Payment Mode">
              <select className={inputCls}><option>Cash</option><option>Card</option><option>UPI</option></select>
            </FormField>
            <FormField label="Apply GST">
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600">Include GST</span>
                </label>
              </div>
            </FormField>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className={btnSecondary}>Cancel</button>
          <button onClick={() => { setShowModal(false); showToast('Sale recorded successfully'); }} className={btnPrimary}>Record Sale</button>
        </div>
      </Modal>
    </div>
  );
};

const PartnerOnlineSales = ({ navigateTo }) => {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(ONLINE_SALES.length / perPage);
  const paged = ONLINE_SALES.slice((page - 1) * perPage, page * perPage);
  const totalRevenue = ONLINE_SALES.reduce((s, o) => s + o.revenue, 0);
  const pendingPayout = ONLINE_SALES.filter(o => ['Processing', 'Shipped'].includes(o.status)).reduce((s, o) => s + o.netPayout, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Online Sales</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Online Revenue" value={formatCurrency(totalRevenue)} icon={<Icons.Online />} color="from-blue-500 to-blue-600" />
        <StatCard title="Pending Payouts" value={formatCurrency(pendingPayout)} icon={<Icons.Settlement />} color="from-amber-500 to-amber-600" />
        <StatCard title="Orders This Month" value={ONLINE_SALES.length.toString()} icon={<Icons.Orders />} color="from-emerald-500 to-emerald-600" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Order ID</Th><Th>Platform</Th><Th>Date</Th><Th>Items</Th><Th>Revenue</Th><Th>Commission</Th><Th>Net Payout</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {paged.map((o, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td><span className="font-mono text-xs font-medium text-blue-600">{o.orderId}</span></Td>
                <Td><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.platform === 'Own Site' ? 'bg-emerald-50 text-emerald-600' : o.platform === 'Amazon' ? 'bg-amber-50 text-amber-600' : o.platform === 'Flipkart' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>{o.platform}</span></Td>
                <Td className="text-xs">{o.date}</Td>
                <Td>{o.items}</Td>
                <Td className="font-medium">{formatCurrency(o.revenue)}</Td>
                <Td className="text-red-500 text-xs">{o.commission > 0 ? `-${formatCurrency(o.commission)}` : '—'}</Td>
                <Td className="font-medium text-emerald-600">{formatCurrency(o.netPayout)}</Td>
                <Td><StatusBadge status={o.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

const PartnerSettlements = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Settlements</h2>
    <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
      <TableWrapper>
        <thead><tr>
          <Th>Settlement ID</Th><Th>Period</Th><Th>Gross Sales</Th><Th>Returns</Th><Th>Commission</Th><Th>TDS</Th><Th>Net Amount</Th><Th>Status</Th>
        </tr></thead>
        <tbody>
          {SETTLEMENTS.map((s, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <Td><span className="font-mono text-xs font-medium text-purple-600">{s.id}</span></Td>
              <Td className="text-xs">{s.period}</Td>
              <Td className="font-medium">{formatCurrency(s.gross)}</Td>
              <Td className="text-red-500 text-xs">-{formatCurrency(s.returns)}</Td>
              <Td className="text-red-500 text-xs">-{formatCurrency(s.commission)}</Td>
              <Td className="text-red-500 text-xs">-{formatCurrency(s.tds)}</Td>
              <Td className="font-semibold text-emerald-600">{formatCurrency(s.net)}</Td>
              <Td><StatusBadge status={s.status} /></Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </div>
  </div>
);

const PartnerGST = ({ navigateTo, showToast }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">GST & Compliance</h2>

    {/* GSTIN Card */}
    <div className="bg-white rounded-2xl border border-slate-200/50 p-5 max-w-md">
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">GSTIN</p>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold font-mono text-slate-800 tracking-wide">07AAHCS1234A1Z5</span>
        <button onClick={() => { navigator.clipboard.writeText('07AAHCS1234A1Z5'); showToast('GSTIN copied to clipboard'); }} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
          <Icons.Copy />
        </button>
      </div>
    </div>

    {/* Monthly Summary */}
    <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
      <h3 className="text-[15px] font-bold text-slate-900 mb-4">Monthly GST Summary</h3>
      <TableWrapper>
        <thead><tr>
          <Th>Month</Th><Th>Taxable Sales</Th><Th>CGST</Th><Th>SGST</Th><Th>IGST</Th><Th>Total Tax</Th><Th>Filed</Th>
        </tr></thead>
        <tbody>
          {GST_DATA.map((g, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <Td className="font-medium">{g.month}</Td>
              <Td>{formatCurrency(g.taxable)}</Td>
              <Td>{formatCurrency(g.cgst)}</Td>
              <Td>{formatCurrency(g.sgst)}</Td>
              <Td>{formatCurrency(g.igst)}</Td>
              <Td className="font-semibold">{formatCurrency(g.total)}</Td>
              <Td>{g.filed ? <span className="text-emerald-600 font-medium flex items-center gap-1"><Icons.Check /> Filed</span> : <span className="text-amber-500 font-medium">Pending</span>}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </div>

    {/* Download buttons */}
    <div className="flex gap-3">
      <button onClick={() => showToast('GSTR-1 Summary download started', 'info')} className={`${btnSecondary} flex items-center gap-2`}>
        <Icons.Download /> GSTR-1 Summary
      </button>
      <button onClick={() => showToast('GSTR-3B Summary download started', 'info')} className={`${btnSecondary} flex items-center gap-2`}>
        <Icons.Download /> GSTR-3B Summary
      </button>
    </div>
  </div>
);
