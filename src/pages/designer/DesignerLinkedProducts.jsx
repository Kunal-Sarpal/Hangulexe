import StatusBadge from '../../components/ui/StatusBadge';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import Breadcrumb from '../../components/ui/Breadcrumb';

const DesignerLinkedProducts = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Linked Products</h2>
    <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
      <TableWrapper>
        <thead><tr>
          <Th>Design</Th><Th>Product SKU</Th><Th>Product Name</Th><Th>Category</Th><Th>Sold</Th><Th>Status</Th>
        </tr></thead>
        <tbody>
          {[
            { design: 'Floral Maxi 2025', sku: 'SKU-003', name: 'Floral Maxi Dress', category: 'Western', sold: 421, status: 'Out of Stock' },
            { design: 'Boho Print', sku: 'SKU-008', name: 'Palazzo Pants', category: 'Fusion', sold: 203, status: 'Out of Stock' },
            { design: 'Minimalist Linen', sku: 'SKU-007', name: 'Formal Blazer', category: 'Formals', sold: 56, status: 'In Stock' },
            { design: 'Ethnic Geometric', sku: 'SKU-001', name: 'Classic White Kurta', category: 'Ethnic Wear', sold: 312, status: 'In Stock' },
            { design: 'Boho Print', sku: 'SKU-006', name: 'Cotton Polo T-Shirt', category: 'Casualwear', sold: 870, status: 'In Stock' },
          ].map((p, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <Td><span className="font-medium text-purple-600">{p.design}</span></Td>
              <Td><span className="font-mono text-xs">{p.sku}</span></Td>
              <Td className="font-medium">{p.name}</Td>
              <Td>{p.category}</Td>
              <Td>{p.sold}</Td>
              <Td><StatusBadge status={p.status} /></Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </div>
  </div>
);

export default DesignerLinkedProducts;
