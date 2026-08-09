import { useState, useEffect } from 'react';
import { apiGetOnlineSales } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import Breadcrumb from '../../components/ui/Breadcrumb';

const PartnerOnlineSales = ({ navigateTo }) => {
  const [page, setPage] = useState(1);
  const [sales, setSales] = useState([]);
  const perPage = 5;

  useEffect(() => {
    apiGetOnlineSales().then(setSales).catch(console.error);
  }, []);

  const totalPages = Math.ceil(sales.length / perPage);
  const paged = sales.slice((page - 1) * perPage, page * perPage);
  const totalRevenue = sales.reduce((s, o) => s + parseFloat(o.revenue), 0);
  const pendingPayout = sales.filter(o => ['Processing', 'Shipped'].includes(o.status)).reduce((s, o) => s + parseFloat(o.netPayout), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Online Sales</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Online Revenue" value={formatCurrency(totalRevenue)} icon={<Icons.Online />} color="from-blue-500 to-blue-600" />
        <StatCard title="Pending Payouts" value={formatCurrency(pendingPayout)} icon={<Icons.Settlement />} color="from-amber-500 to-amber-600" />
        <StatCard title="Orders This Month" value={sales.length.toString()} icon={<Icons.Orders />} color="from-emerald-500 to-emerald-600" />
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

export default PartnerOnlineSales;
