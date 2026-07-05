import { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import Breadcrumb from '../../components/ui/Breadcrumb';

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

export default ManagerOrders;
