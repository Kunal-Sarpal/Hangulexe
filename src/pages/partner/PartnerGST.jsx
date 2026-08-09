import { useState, useEffect } from 'react';
import { apiGetGstData } from '../../api/api';
import { formatCurrency } from '../../utils/helpers';
import Icons from '../../components/Icons';
import { TableWrapper, Th, Td } from '../../components/ui/Table';
import { btnSecondary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';

const PartnerGST = ({ navigateTo, showToast }) => {
  const [gstData, setGstData] = useState([]);

  useEffect(() => {
    apiGetGstData().then(setGstData).catch(console.error);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">GST & Compliance</h2>

      {/* GSTIN Card */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-5 max-w-md">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">GSTIN</p>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold font-mono text-slate-800 tracking-wide">07AAHCS1234A1Z5</span>
          <button onClick={() => { navigator.clipboard.writeText('07AAHCS1234A1Z5'); showToast('GSTIN copied to clipboard'); }} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <Icons.Copy />
          </button>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 card-shadow">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Monthly GST Summary</h3>
        <TableWrapper>
          <thead><tr>
            <Th>Month</Th><Th>Taxable Sales</Th><Th>CGST</Th><Th>SGST</Th><Th>IGST</Th><Th>Total Tax</Th><Th>Filed</Th>
          </tr></thead>
          <tbody>
            {gstData.map((g, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <Td className="font-medium">{g.month}</Td>
                <Td>{formatCurrency(g.taxable)}</Td>
                <Td>{formatCurrency(g.cgst)}</Td>
                <Td>{formatCurrency(g.sgst)}</Td>
                <Td>{formatCurrency(g.igst)}</Td>
                <Td className="font-semibold">{formatCurrency(g.total)}</Td>
                <Td>{g.filed ? <span className="text-emerald-600 font-medium flex items-center gap-1"><Icons.Check /> Filed</span> : <span className="text-amber-500 font-medium">Pending</span>}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      </div>

      {/* Download buttons */}
      <div className="flex gap-3">
        <button onClick={() => showToast('GSTR-1 Summary download started', 'info')} className={`${btnSecondary} flex items-center gap-2`}>
          <Icons.Download /> GSTR-1 Summary
        </button>
        <button onClick={() => showToast('GSTR-3B Summary download started', 'info')} className={`${btnSecondary} flex items-center gap-2`}>
          <Icons.Download /> GSTR-3B Summary
        </button>
      </div>
    </div>
  );
};

export default PartnerGST;
