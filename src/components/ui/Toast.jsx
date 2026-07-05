import Icons from '../Icons';

const Toast = ({ message, visible, type = 'success' }) => {
  if (!visible) return null;
  const colors = type === 'success' ? 'from-emerald-500 to-emerald-600' : type === 'error' ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600';
  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-toast-in">
      <div className={`bg-gradient-to-r ${colors} text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 text-[13px] font-semibold tracking-wide`} style={{ boxShadow: '0 20px 40px -8px rgba(0,0,0,0.25)' }}>
        {type === 'success' && <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"><Icons.Check /></span>}
        {message}
      </div>
    </div>
  );
};

export default Toast;
