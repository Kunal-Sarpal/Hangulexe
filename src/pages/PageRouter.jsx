import ManagerPages from './manager/ManagerPages';
import ReceptionistPages from './receptionist/ReceptionistPages';
import DesignerPages from './designer/DesignerPages';
import PartnerPages from './partner/PartnerPages';
import EmptyState from '../components/ui/EmptyState';

const PageRouter = ({ role, page, navigateTo, showToast, modalState, setModalState }) => {
  switch (role) {
    case 'Manager':
      return <ManagerPages page={page} navigateTo={navigateTo} showToast={showToast} modalState={modalState} setModalState={setModalState} />;
    case 'Receptionist':
      return <ReceptionistPages page={page} navigateTo={navigateTo} showToast={showToast} />;
    case 'Designer':
      return <DesignerPages page={page} navigateTo={navigateTo} showToast={showToast} />;
    case 'Partner':
      return <PartnerPages page={page} navigateTo={navigateTo} showToast={showToast} />;
    default:
      return <EmptyState title="Unknown Role" subtitle="Please log in with a valid role" />;
  }
};

export default PageRouter;
