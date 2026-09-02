export const FormField = ({ label, children, helper, hint }) => (
  <div className="space-y-1.5 text-left">
    <div className="flex items-center justify-between">
      {label && <label className="block text-sm font-semibold text-zinc-900 tracking-tight">{label}</label>}
      {hint && <span className="text-xs text-zinc-400 font-medium">{hint}</span>}
    </div>
    {children}
    {helper && <p className="text-xs text-zinc-500 leading-normal mt-1">{helper}</p>}
  </div>
);

export const inputCls = "w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 font-medium focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400";
export const btnPrimary = "cursor-pointer group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-black bg-opacity-90 text-[#f1f1f1] rounded-full hover:bg-opacity-75 transition-all font-semibold shadow-md active:scale-95 text-xs";
export const btnSecondary = "cursor-pointer inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-zinc-300 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-all active:scale-95";
