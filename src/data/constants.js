// ═══════════════════════════════════════════════════════════
// DUMMY DATA
// ═══════════════════════════════════════════════════════════

export const USERS = {
  'manager@fashionco.com': { name: 'Vikram Joshi', role: 'Manager', initials: 'VJ' },
  'reception@fashionco.com': { name: 'Neha Patel', role: 'Receptionist', initials: 'NP' },
  'designer@fashionco.com': { name: 'Priya Sharma', role: 'Designer', initials: 'PS' },
  'partner@fashionco.com': { name: 'Rajesh Sharma', role: 'Partner', initials: 'RS' },
};

export const ROLE_COLORS = {
  Manager: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200', accent: '#3b82f6', gradient: 'from-blue-500 to-blue-600', accentHex: '#3b82f6', lightHex: '#dbeafe' },
  Receptionist: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', accent: '#22c55e', gradient: 'from-emerald-500 to-emerald-600', accentHex: '#22c55e', lightHex: '#dcfce7' },
  Designer: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200', accent: '#a855f7', gradient: 'from-purple-500 to-purple-600', accentHex: '#a855f7', lightHex: '#f3e8ff' },
  Partner: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200', accent: '#f59e0b', gradient: 'from-amber-500 to-amber-600', accentHex: '#f59e0b', lightHex: '#fef3c7' },
};

export const INVENTORY = [
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

export const COUPONS = [
  { code: 'WELCOME20', type: '% Off', value: '20%', minOrder: 500, validFrom: '01 Jan 2025', validTo: '31 Mar 2025', usage: 234, status: 'Active' },
  { code: 'FLAT100', type: 'Flat Off', value: '₹100', minOrder: 999, validFrom: '15 Jan 2025', validTo: '28 Feb 2025', usage: 89, status: 'Expired' },
  { code: 'SUMMER30', type: '% Off', value: '30%', minOrder: 1500, validFrom: '01 Mar 2025', validTo: '31 May 2025', usage: 12, status: 'Active' },
  { code: 'BOGO-ETHNIC', type: 'BOGO', value: 'Buy 1 Get 1', minOrder: 2000, validFrom: '10 Feb 2025', validTo: '10 Mar 2025', usage: 5, status: 'Active' },
  { code: 'FESTIVE15', type: '% Off', value: '15%', minOrder: 1000, validFrom: '01 Oct 2024', validTo: '31 Dec 2024', usage: 567, status: 'Expired' },
  { code: 'NEWUSER50', type: 'Flat Off', value: '₹50', minOrder: 499, validFrom: '01 Jun 2025', validTo: '30 Jun 2025', usage: 0, status: 'Active' },
];

export const STAFF = [
  { name: 'Neha Patel', id: 'EMP-101', phone: '+91 98765 43210', email: 'neha@fashionco.com', shift: 'Morning (9AM - 5PM)', checkIn: '08:55 AM', status: 'Present' },
  { name: 'Ravi Kumar', id: 'EMP-102', phone: '+91 87654 32109', email: 'ravi@fashionco.com', shift: 'Evening (2PM - 10PM)', checkIn: '01:52 PM', status: 'Present' },
  { name: 'Sunita Devi', id: 'EMP-103', phone: '+91 76543 21098', email: 'sunita@fashionco.com', shift: 'Morning (9AM - 5PM)', checkIn: '—', status: 'Absent' },
  { name: 'Amit Tiwari', id: 'EMP-104', phone: '+91 65432 10987', email: 'amit@fashionco.com', shift: 'Full Day (10AM - 8PM)', checkIn: '09:58 AM', status: 'Present' },
];

export const WALKINS = [
  { id: 'VIS-001', customer: 'Anjali Mehta', phone: '+91 98100 23456', purpose: 'Browse', timeIn: '10:15 AM', timeOut: '11:30 AM', attendedBy: 'Neha Patel', status: 'Completed' },
  { id: 'VIS-002', customer: 'Karan Singh', phone: '+91 99887 76655', purpose: 'Fitting', timeIn: '11:00 AM', timeOut: '—', attendedBy: 'Ravi Kumar', status: 'In Store' },
  { id: 'VIS-003', customer: 'Priya Nair', phone: '+91 88776 65544', purpose: 'Pickup', timeIn: '11:45 AM', timeOut: '12:05 PM', attendedBy: 'Neha Patel', status: 'Completed' },
  { id: 'VIS-004', customer: 'Deepak Gupta', phone: '+91 77665 54433', purpose: 'Return', timeIn: '12:30 PM', timeOut: '—', attendedBy: 'Amit Tiwari', status: 'In Store' },
  { id: 'VIS-005', customer: 'Simran Kaur', phone: '+91 66554 43322', purpose: 'Browse', timeIn: '01:00 PM', timeOut: '02:15 PM', attendedBy: 'Ravi Kumar', status: 'Completed' },
  { id: 'VIS-006', customer: 'Mohit Jain', phone: '+91 55443 32211', purpose: 'Fitting', timeIn: '02:30 PM', timeOut: '—', attendedBy: 'Neha Patel', status: 'In Store' },
];

export const APPOINTMENTS = [
  { time: '10:00 AM', customer: 'Sonia Gupta', service: 'Bridal Lehenga Fitting', status: 'Confirmed' },
  { time: '11:30 AM', customer: 'Rahul Sharma', service: 'Blazer Alteration', status: 'Pending' },
  { time: '2:00 PM', customer: 'Priya Nair', service: 'Saree Draping', status: 'Confirmed' },
  { time: '3:30 PM', customer: 'Mehul Desai', service: 'Kids Wear Pickup', status: 'Cancelled' },
  { time: '4:30 PM', customer: 'Anita Reddy', service: 'Custom Blouse Fitting', status: 'Confirmed' },
  { time: '5:00 PM', customer: 'Vikash Patel', service: 'Suit Measurement', status: 'Pending' },
];

export const RETURNS = [
  { id: 'RET-001', orderId: 'FC-2024-0856', customer: 'Meera Shah', item: 'Slim Fit Chinos', reason: 'Size mismatch', requestedOn: '15 Jun 2025', status: 'Pending' },
  { id: 'RET-002', orderId: 'FC-2024-0823', customer: 'Arjun Kapoor', item: 'Cotton Polo T-Shirt', reason: 'Color faded after wash', requestedOn: '14 Jun 2025', status: 'Approved' },
  { id: 'RET-003', orderId: 'FC-2024-0801', customer: 'Divya Nair', item: 'Floral Maxi Dress', reason: 'Defective stitching', requestedOn: '13 Jun 2025', status: 'Rejected' },
  { id: 'RET-004', orderId: 'FC-2024-0878', customer: 'Rohit Malhotra', item: 'Formal Blazer', reason: 'Wrong item delivered', requestedOn: '16 Jun 2025', status: 'Pending' },
];

export const DESIGNS = [
  { name: 'Floral Maxi 2025', collection: 'Summer Collection', season: 'SS25', status: 'Published', products: 3, color: '#ec4899' },
  { name: 'Ethnic Geometric', collection: 'Festive', season: 'AW24', status: 'Published', products: 2, color: '#f97316' },
  { name: 'Pastel Stripes', collection: 'Casuals', season: 'SS25', status: 'Under Review', products: 0, color: '#a78bfa' },
  { name: 'Embroidery Block', collection: 'Heritage', season: 'AW24', status: 'Draft', products: 0, color: '#fb923c' },
  { name: 'Boho Print', collection: 'Fusion', season: 'SS25', status: 'Published', products: 5, color: '#34d399' },
  { name: 'Minimalist Linen', collection: 'Formals', season: 'SS25', status: 'Published', products: 4, color: '#60a5fa' },
];

export const MOOD_BOARD = [
  { type: 'color', color: '#E8D5B7', label: 'Warm Sand', hex: '#E8D5B7' },
  { type: 'color', color: '#8B4513', label: 'Saddle Brown', hex: '#8B4513' },
  { type: 'note', text: 'Earth tones for SS25 — raw, organic, grounded', color: '#fef3c7' },
  { type: 'fabric', text: 'Raw Silk Texture\nMatte finish, light weave', color: '#fce7f3' },
  { type: 'color', color: '#2D5016', label: 'Forest Green', hex: '#2D5016' },
  { type: 'note', text: 'Inspiration: Rajasthani block prints with modern minimalism', color: '#dbeafe' },
  { type: 'fabric', text: 'Organic Cotton\nSoft hand feel, breathable', color: '#dcfce7' },
  { type: 'color', color: '#C4A882', label: 'Desert Gold', hex: '#C4A882' },
];

export const OFFLINE_SALES = [
  { bill: 'BILL-4501', date: '27 Jun 2025', customer: 'Ananya Mehta', items: 3, total: 4297, payment: 'UPI', gst: true, status: 'Completed' },
  { bill: 'BILL-4502', date: '27 Jun 2025', customer: 'Ravi Shankar', items: 1, total: 2499, payment: 'Card', gst: true, status: 'Completed' },
  { bill: 'BILL-4503', date: '26 Jun 2025', customer: 'Pooja Verma', items: 2, total: 1698, payment: 'Cash', gst: false, status: 'Completed' },
  { bill: 'BILL-4504', date: '26 Jun 2025', customer: 'Suresh Gupta', items: 5, total: 8795, payment: 'Card', gst: true, status: 'Completed' },
  { bill: 'BILL-4505', date: '25 Jun 2025', customer: 'Lakshmi Iyer', items: 1, total: 10999, payment: 'UPI', gst: true, status: 'Refunded' },
  { bill: 'BILL-4506', date: '25 Jun 2025', customer: 'Manish Agarwal', items: 4, total: 5596, payment: 'Cash', gst: true, status: 'Completed' },
];

export const ONLINE_SALES = [
  { orderId: 'ONL-7801', platform: 'Own Site', date: '27 Jun 2025', items: 2, revenue: 3498, commission: 0, netPayout: 3498, status: 'Delivered' },
  { orderId: 'ONL-7802', platform: 'Amazon', date: '27 Jun 2025', items: 1, revenue: 5999, commission: 900, netPayout: 5099, status: 'Shipped' },
  { orderId: 'ONL-7803', platform: 'Flipkart', date: '26 Jun 2025', items: 3, revenue: 4197, commission: 630, netPayout: 3567, status: 'Delivered' },
  { orderId: 'ONL-7804', platform: 'Meesho', date: '26 Jun 2025', items: 1, revenue: 1399, commission: 280, netPayout: 1119, status: 'Processing' },
  { orderId: 'ONL-7805', platform: 'Amazon', date: '25 Jun 2025', items: 2, revenue: 7998, commission: 1200, netPayout: 6798, status: 'Delivered' },
  { orderId: 'ONL-7806', platform: 'Own Site', date: '25 Jun 2025', items: 1, revenue: 2499, commission: 0, netPayout: 2499, status: 'Returned' },
];

export const SETTLEMENTS = [
  { id: 'STL-2025-06', period: '01-15 Jun 2025', gross: 245000, returns: 12500, commission: 18200, tds: 2450, net: 211850, status: 'Paid' },
  { id: 'STL-2025-05B', period: '16-31 May 2025', gross: 312000, returns: 8900, commission: 23400, tds: 3120, net: 276580, status: 'Paid' },
  { id: 'STL-2025-05A', period: '01-15 May 2025', gross: 198000, returns: 5600, commission: 14850, tds: 1980, net: 175570, status: 'Processing' },
  { id: 'STL-2025-06B', period: '16-30 Jun 2025', gross: 287000, returns: 15200, commission: 21500, tds: 2870, net: 247430, status: 'Pending' },
];

export const GST_DATA = [
  { month: 'Jan 2025', taxable: 485000, cgst: 43650, sgst: 43650, igst: 0, total: 87300, filed: true },
  { month: 'Feb 2025', taxable: 523000, cgst: 47070, sgst: 47070, igst: 12500, total: 106640, filed: true },
  { month: 'Mar 2025', taxable: 612000, cgst: 55080, sgst: 55080, igst: 8200, total: 118360, filed: true },
  { month: 'Apr 2025', taxable: 478000, cgst: 43020, sgst: 43020, igst: 5600, total: 91640, filed: true },
  { month: 'May 2025', taxable: 556000, cgst: 50040, sgst: 50040, igst: 9800, total: 109880, filed: false },
  { month: 'Jun 2025', taxable: 389000, cgst: 35010, sgst: 35010, igst: 3200, total: 73220, filed: false },
];

export const MONTHLY_REVENUE = [
  { month: 'Jan', value: 485000 },
  { month: 'Feb', value: 523000 },
  { month: 'Mar', value: 612000 },
  { month: 'Apr', value: 478000 },
  { month: 'May', value: 556000 },
  { month: 'Jun', value: 389000 },
];

export const SHELF_LAYOUT = [
  ['A1', 'A2', 'A3', 'A4'],
  ['B1', 'B2', 'B3', 'B4'],
  ['C1', 'C2', 'C3', 'C4'],
  ['D1', 'D2', 'D3', 'D4'],
];

export const DESIGN_REQUESTS = [
  { id: 'DR-001', title: 'Festive Kurta Print', requester: 'Manager', priority: 'High', deadline: '15 Jul 2025', status: 'New', description: 'Need traditional block print design for Diwali collection kurtas. Should incorporate gold and maroon tones.' },
  { id: 'DR-002', title: 'Summer Casual T-Shirt Graphics', requester: 'Partner', priority: 'Medium', deadline: '20 Jul 2025', status: 'In Progress', description: 'Modern graphic designs for youth casual t-shirt line. Minimal, trendy patterns.' },
  { id: 'DR-003', title: 'Kids Wear Prints', requester: 'Manager', priority: 'Low', deadline: '01 Aug 2025', status: 'New', description: 'Fun, colorful prints for kids wear collection ages 4-12. Animal and nature themes.' },
];

// ═══════════════════════════════════════════════════════════
// SIDEBAR NAVIGATION
// ═══════════════════════════════════════════════════════════

export const SIDEBAR_ITEMS = {
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
