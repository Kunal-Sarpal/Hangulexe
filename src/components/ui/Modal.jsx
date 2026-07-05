import Icons from '../Icons';

const Modal = ({ isOpen, onClose, title, children, width = 'max-w-lg' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" style={{ transition: 'opacity 0.2s' }} />
      <div className={`relative bg-white rounded-3xl ${width} w-full max-h-[85vh] overflow-y-auto animate-scale-in`} style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)' }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl border-b border-slate-100 px-7 py-5 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all hover:rotate-90 duration-200">
            <Icons.Close />
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
