import Icons from '../Icons';

const Breadcrumb = ({ onClick, label = 'Back' }) => (
  <button onClick={onClick} className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-slate-700 mb-6 group transition-all">
    <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
      <Icons.ChevronLeft />
    </span>
    <span className="group-hover:underline underline-offset-2">{label}</span>
  </button>
);

export default Breadcrumb;
