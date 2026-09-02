import { useState, useEffect } from 'react';
import { apiGetOrders } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Modal from '../../components/ui/Modal';
import Icons from '../../components/Icons';

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

  return (
    <div className="space-y-6 animate-fade-in mx-auto max-w-[1400px] w-full px-8 py-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-bold text-[#111827] tracking-tight leading-none">Orders</h2>
            <p className="text-[14px] text-[#6B7280] font-medium leading-none mt-1">{total} real customer orders</p>
          </div>

          <div className="relative w-full lg:w-[320px] h-11">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Icons.Search />
            </span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by Order ID or Customer..."
              className="w-full h-full rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] text-[#111827] font-medium placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              style={{ paddingLeft: '40px', paddingRight: '16px' }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Order ID</Th><Th>Customer</Th><Th>Date</Th><Th>Items</Th><Th>Total</Th><Th>Payment</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                  No orders found. Place an order on the Store to see it appear live!
                </td>
              </tr>
            ) : (
              orders.map((o, i) => (
                <tr key={i} onClick={() => setSelectedOrder(o)} className="hover:bg-slate-50/70 transition-colors cursor-pointer group">
                  <Td><span className="font-mono text-xs font-bold text-blue-600 group-hover:underline">{o.id}</span></Td>
                  <Td>
                    <span className="font-bold text-slate-900 block">{o.customer}</span>
                    <span className="text-xs font-mono text-slate-400">{o.phone}</span>
                  </Td>
                  <Td className="text-slate-600 text-xs">{o.date}</Td>
                  <Td><span className="font-bold text-slate-800">{o.items}</span> <span className="text-xs text-slate-400">items</span></Td>
                  <Td className="font-bold font-mono text-slate-900">{formatCurrency(o.total)}</Td>
                  <Td>
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
                      {o.payment || 'UPI'}
                    </span>
                  </Td>
                  <Td><StatusBadge status={o.status} /></Td>
                </tr>
              ))
            )}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Order Details Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order Details: ${selectedOrder?.id || ''}`} width="max-w-md">
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
