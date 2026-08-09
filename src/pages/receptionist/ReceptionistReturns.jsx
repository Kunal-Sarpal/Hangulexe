import { useState, useEffect } from 'react';
import { apiGetReturns } from '../../api/api';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import Breadcrumb from '../../components/ui/Breadcrumb';

const ReceptionistReturns = ({ navigateTo }) => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    apiGetReturns().then(setReturns).catch(console.error);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Returns & Exchanges</h2>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Return ID</Th><Th>Order ID</Th><Th>Customer</Th><Th>Item</Th><Th>Reason</Th><Th>Requested</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {returns.map((r, i) => (
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
};

export default ReceptionistReturns;
