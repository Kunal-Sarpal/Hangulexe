import { useState } from 'react';
import { WALKINS } from '../../data/constants';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import Breadcrumb from '../../components/ui/Breadcrumb';

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

export default ReceptionistWalkins;
