import Icons from '../Icons';

const EmptyState = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
    <div className="animate-float w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5"><Icons.EmptyBox /></div>
    <h3 className="text-base font-bold text-slate-500 tracking-tight">{title}</h3>
    <p className="mt-1.5 text-sm text-slate-400 max-w-xs text-center leading-relaxed">{subtitle}</p>
  </div>
);

export default EmptyState;
