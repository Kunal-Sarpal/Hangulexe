import DesignerDashboard from './DesignerDashboard';
import DesignerMyDesigns from './DesignerMyDesigns';
import DesignerUploadDesign from './DesignerUploadDesign';
import DesignerCollections from './DesignerCollections';
import DesignerLinkedProducts from './DesignerLinkedProducts';
import DesignerMoodBoard from './DesignerMoodBoard';
import DesignerRequests from './DesignerRequests';

const DesignerPages = ({ page, navigateTo, showToast }) => {
  switch (page) {
    case 'dashboard': return <DesignerDashboard navigateTo={navigateTo} />;
    case 'myDesigns': return <DesignerMyDesigns navigateTo={navigateTo} />;
    case 'uploadDesign': return <DesignerUploadDesign navigateTo={navigateTo} showToast={showToast} />;
    case 'collections': return <DesignerCollections navigateTo={navigateTo} />;
    case 'linkedProducts': return <DesignerLinkedProducts navigateTo={navigateTo} />;
    case 'moodBoard': return <DesignerMoodBoard navigateTo={navigateTo} />;
    case 'designRequests': return <DesignerRequests navigateTo={navigateTo} />;
    default: return <DesignerDashboard navigateTo={navigateTo} />;
  }
};

export default DesignerPages;
