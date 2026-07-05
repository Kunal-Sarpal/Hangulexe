import Icons from '../Icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-5 mt-4 border-t border-[#E5E7EB]">
      <p className="text-[13px] text-[#6B7280] font-medium">Page {currentPage} of {totalPages}</p>
      <div className="flex items-center gap-1.5">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer">
          <Icons.ChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => onPageChange(i + 1)} className={`w-9 h-9 rounded-[10px] text-[13px] font-semibold transition-all duration-200 cursor-pointer ${currentPage === i + 1 ? 'bg-[#2563EB] text-white shadow-sm shadow-[#2563EB]/25' : 'text-[#6B7280] hover:bg-[#F9FAFB]'}`}>
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer">
          <Icons.ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
