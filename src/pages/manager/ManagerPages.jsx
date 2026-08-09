import ManagerDashboard from './ManagerDashboard';
import ManagerInventory from './ManagerInventory';
import ManagerLayout from './ManagerLayout';
import ManagerOrders from './ManagerOrders';
import ManagerStaff from './ManagerStaff';
import ManagerCoupons from './ManagerCoupons';
import ManagerReports from './ManagerReports';
import ManagerSettings from './ManagerSettings';
import AnalyticsDashboard from '../dashboards/AnalyticsDashboard';

const ManagerPages = ({ page, navigateTo, showToast, modalState, setModalState }) => {
  switch (page) {
    case 'dashboard': return <ManagerDashboard navigateTo={navigateTo} />;
    case 'analytics': return <AnalyticsDashboard />;
    case 'inventory': return <ManagerInventory navigateTo={navigateTo} showToast={showToast} />;
    case 'layout': return <ManagerLayout navigateTo={navigateTo} />;
    case 'orders': return <ManagerOrders navigateTo={navigateTo} />;
    case 'staff': return <ManagerStaff navigateTo={navigateTo} />;
    case 'coupons': return <ManagerCoupons navigateTo={navigateTo} showToast={showToast} />;
    case 'reports': return <ManagerReports navigateTo={navigateTo} />;
    case 'settings': return <ManagerSettings navigateTo={navigateTo} showToast={showToast} />;
    default: return <ManagerDashboard navigateTo={navigateTo} />;
  }
};

export default ManagerPages;
