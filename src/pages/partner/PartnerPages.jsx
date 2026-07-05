import PartnerDashboard from './PartnerDashboard';
import PartnerBusinessProfile from './PartnerBusinessProfile';
import PartnerInventory from './PartnerInventory';
import PartnerOfflineSales from './PartnerOfflineSales';
import PartnerOnlineSales from './PartnerOnlineSales';
import PartnerSettlements from './PartnerSettlements';
import PartnerGST from './PartnerGST';

const PartnerPages = ({ page, navigateTo, showToast }) => {
  switch (page) {
    case 'dashboard': return <PartnerDashboard navigateTo={navigateTo} />;
    case 'businessProfile': return <PartnerBusinessProfile navigateTo={navigateTo} showToast={showToast} />;
    case 'partnerInventory': return <PartnerInventory navigateTo={navigateTo} />;
    case 'offlineSales': return <PartnerOfflineSales navigateTo={navigateTo} showToast={showToast} />;
    case 'onlineSales': return <PartnerOnlineSales navigateTo={navigateTo} />;
    case 'settlements': return <PartnerSettlements navigateTo={navigateTo} />;
    case 'gst': return <PartnerGST navigateTo={navigateTo} showToast={showToast} />;
    default: return <PartnerDashboard navigateTo={navigateTo} />;
  }
};

export default PartnerPages;
