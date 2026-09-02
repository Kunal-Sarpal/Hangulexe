import { useState } from 'react';
import Icons from '../../components/Icons';
import Breadcrumb from '../../components/ui/Breadcrumb';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const REPORTS_DATA = {
  'Sales Report': {
    metrics: [
      { label: 'Total Revenue', value: '₹14,85,000', change: '+18.4%' },
      { label: 'Net Profit Margin', value: '₹5,20,000', change: '+12.1%' },
      { label: 'Avg Order Value', value: '₹24,750', change: '+5.6%' },
      { label: 'Total Orders', value: '184 Orders', change: '+22.0%' }
    ],
    salesChart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Store POS (Walk-in)',
          data: [180000, 220000, 210000, 290000, 340000, 410000],
          backgroundColor: '#2563EB',
          borderColor: '#2563EB',
          tension: 0.3
        },
        {
          label: 'Online Store',
          data: [120000, 150000, 190000, 210000, 280000, 350000],
          backgroundColor: '#2DD4BF',
          borderColor: '#2DD4BF',
          tension: 0.3
        }
      ]
    },
    doughnutData: {
      labels: ['Ethnic Wear', 'Western Gowns', 'Kurta Sets', 'Menswear Sherwani', 'Accessories'],
      datasets: [
        {
          data: [45, 20, 18, 12, 5],
          backgroundColor: ['#2563EB', '#2DD4BF', '#F59E0B', '#EC4899', '#8B5CF6']
        }
      ]
    }
  },
  'Inventory Report': {
    metrics: [
      { label: 'Catalog SKU Count', value: '24 SKUs', change: 'Active' },
      { label: 'Stock Valuation', value: '₹42,50,000', change: 'In Stock' },
      { label: 'Low Stock Items', value: '3 SKUs', change: 'Action Needed' },
      { label: 'Out of Stock', value: '1 SKU', change: 'Reorder' }
    ],
    stockChart: {
      labels: ['Silk Lehenga', 'Chanderi Kurta', 'Bandhgala', 'Anarkali Suit', 'Evening Gown'],
      datasets: [
        {
          label: 'In Stock Units',
          data: [15, 5, 10, 22, 0],
          backgroundColor: '#3B82F6'
        },
        {
          label: 'Units Sold',
          data: [8, 12, 4, 15, 14],
          backgroundColor: '#10B981'
        }
      ]
    },
    items: [
      { sku: 'SKU-001', name: 'Embroidered Silk Lehenga', category: 'Ethnic Wear', stock: 15, sold: 8, turnover: 'Fast' },
      { sku: 'SKU-002', name: 'Royal Chanderi Silk Kurta Set', category: 'Ethnic Wear', stock: 5, sold: 12, turnover: 'High Demand' },
      { sku: 'SKU-003', name: 'Designer Bandhgala Sherwani', category: 'Formals', stock: 10, sold: 4, turnover: 'Medium' },
      { sku: 'SKU-004', name: 'Handcrafted Anarkali Suit', category: 'Ethnic Wear', stock: 22, sold: 15, turnover: 'Fast' },
      { sku: 'SKU-006', name: 'Sequin Embellished Evening Gown', category: 'Western', stock: 0, sold: 14, turnover: 'Out of Stock' }
    ]
  },
  'Staff Performance': {
    metrics: [
      { label: 'Total Active Staff', value: '8 Employees', change: '100% Present' },
      { label: 'Avg Sales Per Rep', value: '₹1,85,000', change: '+14%' },
      { label: 'Total Walk-ins Attended', value: '342 Visits', change: '92% Satisfaction' }
    ],
    staffChart: {
      labels: ['Alia Bhatt', 'Ranbir Kapoor', 'Deepika Padukone', 'Ranveer Singh'],
      datasets: [
        {
          label: 'Sales Revenue (₹)',
          data: [420000, 350000, 290000, 240000],
          backgroundColor: '#8B5CF6'
        }
      ]
    },
    staff: [
      { name: 'Alia Bhatt', role: 'Senior Sales Executive', sales: '₹4,20,000', orders: 34, attendance: '98%' },
      { name: 'Ranbir Kapoor', role: 'Inventory Manager', sales: '₹3,50,000', orders: 28, attendance: '96%' },
      { name: 'Deepika Padukone', role: 'Stylist & Advisor', sales: '₹2,90,000', orders: 22, attendance: '100%' },
      { name: 'Ranveer Singh', role: 'Sales Specialist', sales: '₹2,40,000', orders: 19, attendance: '94%' }
    ]
  },
  'Coupon Analysis': {
    metrics: [
      { label: 'Active Coupons', value: '4 Promo Codes', change: 'Running' },
      { label: 'Redemptions', value: '142 Times', change: '+32%' },
      { label: 'Total Discount Value', value: '₹1,45,000', change: '10% Avg' },
      { label: 'Revenue Influenced', value: '₹6,80,000', change: '+45%' }
    ],
    coupons: [
      { code: 'FESTIVE15', discount: '15% OFF', uses: 68, revenue: '₹3,20,000', status: 'Active' },
      { code: 'WELCOME10', discount: '10% OFF', uses: 45, revenue: '₹2,10,000', status: 'Active' },
      { code: 'VIPSUMMER', discount: '20% OFF', uses: 22, revenue: '₹1,30,000', status: 'Active' },
      { code: 'FIRST500', discount: '₹500 Flat', uses: 7, revenue: '₹20,000', status: 'Expired' }
    ]
  },
  'Customer Insights': {
    metrics: [
      { label: 'Total Customers', value: '540 Registered', change: '+24 This Month' },
      { label: 'Repeat Customer Rate', value: '68.4%', change: '+8.2%' },
      { label: 'Avg Customer Lifetime Value', value: '₹48,500', change: '+15.5%' }
    ],
    topCustomers: [
      { name: 'Shahrukh Khan', phone: '9988776655', orders: 12, spent: '₹2,40,000', tier: 'VIP Gold' },
      { name: 'Priyanka Chopra', phone: '9123456789', orders: 8, spent: '₹1,80,000', tier: 'VIP Silver' },
      { name: 'Kareena Kapoor', phone: '9811223344', orders: 6, spent: '₹1,45,000', tier: 'Regular' },
      { name: 'Katrina Kaif', phone: '9711002288', orders: 5, spent: '₹1,20,000', tier: 'Regular' }
    ]
  },
  'GST Summary': {
    metrics: [
      { label: 'Taxable Turnover', value: '₹12,50,000', change: 'Q2 FY26' },
      { label: 'CGST (9%)', value: '₹1,12,500', change: 'Output Tax' },
      { label: 'SGST (9%)', value: '₹1,12,500', change: 'Output Tax' },
      { label: 'Total Tax Collected', value: '₹2,25,000', change: 'Filing Due' }
    ],
    filingHistory: [
      { period: 'June 2026', gstr1: 'Filed (ACK-9812)', gstr3b: 'Filed (ACK-9813)', tax: '₹2,10,000' },
      { period: 'May 2026', gstr1: 'Filed (ACK-8761)', gstr3b: 'Filed (ACK-8762)', tax: '₹1,95,000' },
      { period: 'April 2026', gstr1: 'Filed (ACK-7651)', gstr3b: 'Filed (ACK-7652)', tax: '₹1,80,000' }
    ]
  }
};

const ManagerReports = ({ navigateTo, showToast }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [timeRange, setTimeRange] = useState('This Month');

  const reportCards = [
    { title: 'Sales Report', desc: 'Revenue breakdown by day, week, month', icon: <Icons.Reports />, color: 'from-blue-500 to-indigo-600', iconBg: 'bg-[#2563EB]/10 text-[#2563EB]' },
    { title: 'Inventory Report', desc: 'Stock levels, low stock alerts, movement', icon: <Icons.Inventory />, color: 'from-emerald-500 to-teal-600', iconBg: 'bg-emerald-500/10 text-emerald-600' },
    { title: 'Staff Performance', desc: 'Attendance, sales per receptionist', icon: <Icons.Staff />, color: 'from-purple-500 to-pink-600', iconBg: 'bg-purple-500/10 text-purple-600' },
    { title: 'Coupon Analysis', desc: 'Usage rates, revenue impact', icon: <Icons.Coupon />, color: 'from-amber-500 to-orange-600', iconBg: 'bg-amber-500/10 text-amber-600' },
    { title: 'Customer Insights', desc: 'Repeat customers, top spenders', icon: <Icons.Walkin />, color: 'from-pink-500 to-rose-600', iconBg: 'bg-rose-500/10 text-rose-600' },
    { title: 'GST Summary', desc: 'Tax collected, filed status', icon: <Icons.GST />, color: 'from-slate-600 to-slate-800', iconBg: 'bg-slate-700/10 text-slate-800' },
  ];

  const handleExport = (reportTitle) => {
    if (showToast) showToast(`Exported ${reportTitle} successfully!`);
  };

  const reportData = selectedReport ? REPORTS_DATA[selectedReport] : null;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE4] pb-4">
        <div>
          <h2 className="text-xl font-black text-[#2A3F54] tracking-tight">
            {selectedReport ? selectedReport : 'Analytics & Business Reports'}
          </h2>
          <p className="text-xs text-[#73879C] mt-0.5">
            {selectedReport ? `Interactive performance analytics for ${selectedReport.toLowerCase()}` : 'Select a business category to inspect trends, charts & data digests'}
          </p>
        </div>

        {selectedReport && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-gray-100 p-0.5 rounded-lg border border-[#D9DEE4] text-xs font-semibold">
              {['This Month', 'Quarter', 'This Year'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${timeRange === t ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleExport(selectedReport)}
              className="cursor-pointer group relative inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-black bg-opacity-90 text-[#f1f1f1] rounded-full hover:bg-opacity-75 transition-all font-semibold shadow-md active:scale-95 text-xs"
            >
              <Icons.Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setSelectedReport(null)}
              className="px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
            >
              ← Back
            </button>
          </div>
        )}
      </div>

      {/* Main Reports Cards Grid */}
      {!selectedReport ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCards.map((r, i) => (
            <div
              key={i}
              onClick={() => setSelectedReport(r.title)}
              className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none relative px-4 pt-4 pb-3 md:px-5 md:pt-4.5 md:pb-3.5 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:border-zinc-400 group min-h-[140px]"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
                  {r.icon}
                </div>
                <h3 className="font-bold text-zinc-900 text-base group-hover:text-indigo-600 transition-colors">{r.title}</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{r.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 group-hover:text-indigo-600 group-hover:underline">Explore Report →</span>
                <span className="text-[10px] text-zinc-400 font-mono uppercase">Live Data</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Interactive Chart View */
        <div className="space-y-6 animate-fade-in">
          
          {/* Key Metrics Row */}
          {reportData?.metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportData.metrics.map((m, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-black text-slate-900">{m.value}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{m.change}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sales Report Charts */}
          {selectedReport === 'Sales Report' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Monthly Revenue Trend (Line & Bar Chart)</h3>
                <div className="h-72">
                  <Line data={reportData.salesChart} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <h3 className="font-bold text-slate-900 text-base">Sales Share by Category</h3>
                <div className="h-60 flex items-center justify-center">
                  <Doughnut data={reportData.doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          )}

          {/* Inventory Report Charts */}
          {selectedReport === 'Inventory Report' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Stock Levels vs Units Sold (Bar Chart)</h3>
                <div className="h-72">
                  <Bar data={reportData.stockChart} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Inventory Item Velocity Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <tr><th className="p-3">SKU</th><th className="p-3">Product Name</th><th className="p-3">Category</th><th className="p-3 text-center">Stock</th><th className="p-3 text-right">Sold</th><th className="p-3">Velocity</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportData.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-600">{it.sku}</td>
                          <td className="p-3 font-bold text-slate-900">{it.name}</td>
                          <td className="p-3 text-slate-600">{it.category}</td>
                          <td className="p-3 text-center font-bold">{it.stock}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">{it.sold}</td>
                          <td className="p-3"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">{it.turnover}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Staff Performance Chart */}
          {selectedReport === 'Staff Performance' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Staff Sales Revenue Breakdown</h3>
                <div className="h-72">
                  <Bar data={reportData.staffChart} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          )}

          {/* Customer Insights & Coupon Table Views */}
          {selectedReport === 'Coupon Analysis' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Active Promo Codes & Revenue Impact</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr><th className="p-3">Coupon Code</th><th className="p-3">Discount</th><th className="p-3 text-center">Uses</th><th className="p-3 text-right">Revenue Generated</th><th className="p-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.coupons.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-600">{c.code}</td>
                        <td className="p-3 font-bold text-slate-800">{c.discount}</td>
                        <td className="p-3 text-center font-bold">{c.uses}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">{c.revenue}</td>
                        <td className="p-3"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-50 text-green-700">{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === 'Customer Insights' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Top Spenders & Repeat VIP Customers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr><th className="p-3">Customer Name</th><th className="p-3">Phone</th><th className="p-3 text-center">Total Orders</th><th className="p-3 text-right">Total Spent</th><th className="p-3">Tier</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.topCustomers.map((cust, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{cust.name}</td>
                        <td className="p-3 font-mono text-slate-500">{cust.phone}</td>
                        <td className="p-3 text-center font-bold">{cust.orders}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-600">{cust.spent}</td>
                        <td className="p-3"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700">{cust.tier}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === 'GST Summary' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">GST Filing & Return Acknowledgements</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr><th className="p-3">Period</th><th className="p-3">GSTR-1 Status</th><th className="p-3">GSTR-3B Status</th><th className="p-3 text-right">Tax Liability</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.filingHistory.map((f, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{f.period}</td>
                        <td className="p-3 text-emerald-600 font-bold">{f.gstr1}</td>
                        <td className="p-3 text-emerald-600 font-bold">{f.gstr3b}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">{f.tax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ManagerReports;
