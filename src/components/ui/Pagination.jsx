import Icons from '../Icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-5 mt-4 border-t border-zinc-200/90">
      <p className="text-[13px] text-zinc-500 font-medium">Page <span className="font-machina font-bold text-zinc-800">{currentPage}</span> of <span className="font-machina font-bold text-zinc-800">{totalPages}</span></p>
      <div className="flex items-center gap-1.5">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
          <Icons.ChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => onPageChange(i + 1)} className={`w-8 h-8 rounded-[8px] text-xs font-bold font-machina transition-all duration-150 cursor-pointer ${currentPage === i + 1 ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:bg-zinc-100'}`}>
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
          <Icons.ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
