import ReceptionistDashboard from './ReceptionistDashboard';
import ReceptionistWalkins from './ReceptionistWalkins';
import ReceptionistAppointments from './ReceptionistAppointments';
import ReceptionistOrderLookup from './ReceptionistOrderLookup';
import ReceptionistReturns from './ReceptionistReturns';
import ReceptionistFeedback from './ReceptionistFeedback';
import ReceptionistDailyLog from './ReceptionistDailyLog';

const ReceptionistPages = ({ page, navigateTo, showToast }) => {
  switch (page) {
    case 'dashboard': return <ReceptionistDashboard navigateTo={navigateTo} />;
    case 'walkins': return <ReceptionistWalkins navigateTo={navigateTo} />;
    case 'appointments': return <ReceptionistAppointments navigateTo={navigateTo} />;
    case 'orderLookup': return <ReceptionistOrderLookup navigateTo={navigateTo} />;
    case 'returns': return <ReceptionistReturns navigateTo={navigateTo} />;
    case 'feedback': return <ReceptionistFeedback navigateTo={navigateTo} showToast={showToast} />;
    case 'dailyLog': return <ReceptionistDailyLog navigateTo={navigateTo} />;
    default: return <ReceptionistDashboard navigateTo={navigateTo} />;
  }
};

export default ReceptionistPages;
