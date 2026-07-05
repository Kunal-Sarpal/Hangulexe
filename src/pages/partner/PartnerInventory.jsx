import { useState } from 'react';
import { INVENTORY } from '../../data/constants';
import { formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import Breadcrumb from '../../components/ui/Breadcrumb';

const PartnerInventory = ({ navigateTo }) => {
  const [page, setPage] = useState(1);
  const perPage = 6;
  const totalPages = Math.ceil(INVENTORY.length / perPage);
  const paged = INVENTORY.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <div>
        <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Inventory</h2>
        <p className="text-xs text-slate-400 mt-1">Read-only view — Contact manager for changes</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <TableWrapper>
          <thead><tr>
            <Th>SKU</Th><Th>Product</Th><Th>Category</Th><Th>MRP</Th><Th>Selling ₹</Th><Th>Stock</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {paged.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td><span className="font-mono text-xs font-medium text-blue-600">{item.sku}</span></Td>
                <Td className="font-medium">{item.name}</Td>
                <Td>{item.category}</Td>
                <Td>{formatCurrency(item.mrp)}</Td>
                <Td className="font-medium">{formatCurrency(item.sellingPrice)}</Td>
                <Td>{item.stock}</Td>
                <Td><StatusBadge status={item.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default PartnerInventory;
