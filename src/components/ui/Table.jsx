export const TableWrapper = ({ children }) => (
  <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
    <table className="w-full text-[14px] border-collapse">{children}</table>
  </div>
);

export const Th = ({ children, className = '' }) => (
  <th className={`h-12 px-4 text-left text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider bg-[#F9FAFB] border-b border-[#E5E7EB] align-middle ${className}`}>{children}</th>
);

export const Td = ({ children, className = '' }) => (
  <td className={`h-[58px] px-4 text-[14px] text-[#111827] border-b border-[#F3F4F6] align-middle ${className}`}>{children}</td>
);
