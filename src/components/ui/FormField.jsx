export const FormField = ({ label, children }) => (
  <div className="space-y-2">
    <label className="block text-[13px] font-semibold text-slate-500 tracking-wide" style={{ letterSpacing: '0.02em' }}>{label}</label>
    {children}
  </div>
);

export const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.06)] transition-all placeholder:text-slate-300 placeholder:font-normal";
export const btnPrimary = "px-6 py-3 rounded-xl bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 transition-all active:scale-[0.97] tracking-wide" + " shadow-[0_4px_14px_-3px_rgba(15,23,42,0.3)]";
export const btnSecondary = "px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.97]";
