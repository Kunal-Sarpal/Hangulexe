import { useState } from 'react';
import { apiLookupOrder } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import { inputCls, btnPrimary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';

const ReceptionistOrderLookup = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await apiLookupOrder(searchQuery);
      setResult(data.result);
    } catch {
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

export default ReceptionistOrderLookup;
