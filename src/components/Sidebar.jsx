import Icons from './Icons';
import { SIDEBAR_ITEMS } from '../data/constants';

const Sidebar = ({ role, currentPage, navigateTo, sidebarOpen, setSidebarOpen, onLogout }) => {
  const sidebarItems = SIDEBAR_ITEMS[role] || [];

  return (
    <aside className="sidebar shrink-0 z-30" style={{ width: sidebarOpen ? '240px' : '76px', borderRight: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-6">
        {sidebarOpen && (
          <div className="animate-slide-in flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md">FC</div>
            <span className="font-bold text-slate-900 text-[15px] tracking-tight">Fashion Co</span>
          </div>
        )}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
          <Icons.Menu />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {sidebarOpen && <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.12em] mb-3">Navigation</p>}
        {sidebarItems.map((item) => {
          const Icon = Icons[item.icon];
          const isActive = currentPage === item.id;
          return (
            <button key={item.id} onClick={() => navigateTo(item.id)} title={item.label} className={`sidebar-nav-item ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`}>
              <span className={`shrink-0`}>{Icon && <Icon />}</span>
              {sidebarOpen && <span className="animate-slide-in truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 pt-4 mt-auto">
        <button onClick={onLogout} className={`sidebar-nav-item hover:bg-red-50 hover:text-red-600 ${!sidebarOpen ? 'justify-center px-0' : ''}`}>
          <Icons.Logout />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
