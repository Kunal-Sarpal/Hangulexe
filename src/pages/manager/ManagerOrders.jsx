import { useState, useEffect } from 'react';
import { apiGetOrders } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';
import Icons from '../../components/Icons';
import { AdminCard, AdminStatCard } from '../../components/ui/AdminCard';

const ManagerOrders = ({ navigateTo, showToast }) => {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const perPage = 6;

  const fetchOrders = () => {
    apiGetOrders({ page, limit: perPage, search }).then(data => {
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  const handleUpdateStatus = async (orderNumber, newStatus) => {
    try {
      const res = await fetch('/api/orders/pay-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber })
      });
      const data = await res.json();
      if (res.ok) {
        if (showToast) showToast(`Order ${orderNumber} updated to ${newStatus}`);
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const completedCount = orders.filter(o => o.status === 'Delivered' || o.status === 'Completed' || o.status === 'Paid').length;
  const ordersTotalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in text-left">

      {/* Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE4] pb-4">
        <div>
          <h2 className="text-xl font-black text-[#2A3F54] tracking-tight">Order Management</h2>
          <p className="text-xs text-[#73879C] mt-0.5">{total} live customer orders in store</p>
        </div>

        <div className="relative w-full sm:w-72 h-10">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icons.Search />
          </span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search Order ID or Customer..."
            className="w-full h-full pl-9 pr-3 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all"
          />
        </div>
      </div>

      {/* Top Order Metrics using Reusable AdminStatCard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Orders"
          value={total}
          subtext="All recorded orders"
        />
        <AdminStatCard
          label="Pending Action"
          value={pendingCount}
          subtext="Awaiting delivery or payment"
        />
        <AdminStatCard
          label="Completed Orders"
          value={completedCount}
          subtext="Fulfilled & paid"
        />
        <AdminStatCard
          label="Batch Revenue"
          value={formatCurrency(ordersTotalRevenue)}
          subtext="Current page aggregate"
        />
      </div>

      {/* Orders DataTable in AdminCard */}
      <div className="w-full bg-white border border-zinc-200/90 rounded-[10px] shadow-none overflow-hidden transition-all duration-300">
        <div className="px-5 py-3.5 border-b border-zinc-200/90 flex items-center justify-between bg-zinc-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Customer Orders List
          </h3>
          <span className="text-xs text-zinc-400">Click row for details & receipt</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200/90 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/90 text-xs font-medium text-zinc-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    No orders found. Place an order on the Store to see it appear live!
                  </td>
                </tr>
              ) : (
                orders.map((o, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedOrder(o)}
                    className="hover:bg-zinc-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-5">
                      <span className="font-machina font-bold text-zinc-900 group-hover:underline">
                        {o.id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-zinc-900 block">{o.customer}</span>
                      <span className="text-[11px] font-machina text-zinc-400">{o.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">{o.date}</td>
                    <td className="py-3 px-4 text-zinc-800 font-machina font-semibold">{o.items} items</td>
                    <td className="py-3 px-4 text-right font-bold text-zinc-900 font-machina">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded border border-zinc-200 font-machina">
                        {o.payment || 'UPI'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <div className="flex items-center justify-center">
                        <StatusBadge status={o.status} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 px-5 border-t border-zinc-200/90 flex items-center justify-between text-xs text-zinc-500">
          <span>Showing Page {page} of {totalPages} ({total} Orders)</span>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title={`Order Details: ${selectedOrder?.id || ''}`} 
        subtitle="Live customer transaction details and itemized receipt breakdown."
        width="max-w-md"
      >
        {selectedOrder && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500 font-medium">Customer Name</span>
                <h4 className="font-bold text-slate-900 text-base">{selectedOrder.customer}</h4>
                <p className="text-xs font-mono text-slate-500">{selectedOrder.phone}</p>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            {selectedOrder.address && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  📍 Delivery Address
                </span>
                <p className="font-semibold text-slate-800 leading-relaxed">
                  {selectedOrder.address}
                </p>
              </div>
            )}

            <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ordered Items</h5>
              {selectedOrder.itemList && selectedOrder.itemList.length > 0 ? (
                selectedOrder.itemList.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-100 last:border-b-0">
                    <span className="font-medium text-slate-800">{item.item_name} × {item.quantity}</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(item.total_price || (item.unit_price * item.quantity))}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Item breakdown available on receipt</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium block">Total Payable</span>
                <span className="font-mono text-base font-black text-slate-900">{formatCurrency(selectedOrder.total)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium block">Payment Method</span>
                <span className="font-bold text-slate-800 text-sm">{selectedOrder.payment || 'UPI QR'}</span>
              </div>
            </div>

            {selectedOrder.status === 'Pending' && (
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'Completed')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm py-3 rounded-xl shadow transition-colors cursor-pointer mt-2"
              >
                Mark Order as Paid & Completed
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagerOrders;
