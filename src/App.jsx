import { useState, useCallback } from 'react';
import { ROLE_COLORS } from './data/constants';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/ui/Toast';
import PageRouter from './pages/PageRouter';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [modalState, setModalState] = useState({ type: null, data: null });

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, visible: true }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentPage('dashboard');
  }, []);

  if (!user) return <LoginScreen onLogin={setUser} />;

  const role = user.role;
  const rc = ROLE_COLORS[role];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)', '--bg-accent': rc.lightHex, '--text-accent': rc.accentHex }}>
      {/* Sidebar */}
      <Sidebar
        role={role}
        currentPage={currentPage}
        navigateTo={navigateTo}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <Topbar user={user} rc={rc} />

        {/* Page Content */}
        <main className="main-content">
          <PageRouter role={role} page={currentPage} navigateTo={navigateTo} showToast={showToast} modalState={modalState} setModalState={setModalState} />
        </main>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3">
        {toasts.map(t => <Toast key={t.id} message={t.message} visible={t.visible} type={t.type} />)}
      </div>
    </div>
  );
}
