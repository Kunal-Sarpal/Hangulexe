import { useState, useEffect } from 'react';
import { apiGetSettlements } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import Breadcrumb from '../../components/ui/Breadcrumb';

const PartnerSettlements = ({ navigateTo }) => {
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    apiGetSettlements().then(setSettlements).catch(console.error);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Settlements</h2>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>Settlement ID</Th><Th>Period</Th><Th>Gross Sales</Th><Th>Returns</Th><Th>Commission</Th><Th>TDS</Th><Th>Net Amount</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {settlements.map((s, i) => (
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
};

export default PartnerSettlements;
