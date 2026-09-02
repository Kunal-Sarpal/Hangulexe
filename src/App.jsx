import { useState, useCallback, useEffect } from 'react';
import { ROLE_COLORS } from './data/constants';
import { apiGetMe, removeToken } from './api/api';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/ui/Toast';
import PageRouter from './pages/PageRouter';
import { useRouter } from './hooks/useRouter';
import StoreRouter from './pages/store/StoreRouter';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session from JWT token on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('fashionco_token');
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const data = await apiGetMe();
        setUser({ ...data.user });
      } catch {
        removeToken();
      }
      setAuthLoading(false);
    };
    restoreSession();
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, visible: true }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleLogout = useCallback(() => {
    removeToken();
    setUser(null);
    setCurrentPage('dashboard');
  }, []);

  const { path } = useRouter();

  // Show loading only for a split second to prevent auth flashing
  if (authLoading) return <div className="h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  // Route to Admin Dashboard
  let content;
  if (path.startsWith('/admin')) {
    if (!user) {
      content = <LoginScreen onLogin={setUser} />;
    } else {
      const role = user.role;
      const rc = ROLE_COLORS[role] || ROLE_COLORS['Manager'];

      content = (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg-primary)', '--bg-accent': rc.lightHex, '--text-accent': rc.accentHex }}>
          <Sidebar role={role} currentPage={currentPage} navigateTo={navigateTo} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar user={user} rc={rc} onLogout={handleLogout} />
            <main className="main-content">
              <PageRouter role={role} page={currentPage} navigateTo={navigateTo} showToast={showToast} modalState={modalState} setModalState={setModalState} />
            </main>
          </div>
        </div>
      );
    }
  } else {
    // Public Storefront Routing
    content = <StoreRouter user={user} setUser={setUser} handleLogout={handleLogout} showToast={showToast} />;
  }

  return (
    <>
      {content}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3">
        {toasts.map(t => <Toast key={t.id} message={t.message} visible={t.visible} type={t.type} />)}
      </div>
    </>
  );
}
