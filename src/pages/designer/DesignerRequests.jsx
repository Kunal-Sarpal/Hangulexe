import { DESIGN_REQUESTS } from '../../data/constants';
import StatusBadge from '../../components/ui/StatusBadge';
import Breadcrumb from '../../components/ui/Breadcrumb';

const DesignerRequests = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Design Requests</h2>
    <div className="space-y-4">
      {DESIGN_REQUESTS.map((req, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/50 p-5 card-shadow hover:card-shadow-lg transition-all animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">{req.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${req.priority === 'High' ? 'bg-red-50 text-red-600' : req.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{req.priority}</span>
              </div>
              <h3 className="font-bold text-slate-900 mt-1">{req.title}</h3>
            </div>
            <StatusBadge status={req.status} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{req.description}</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
            <span>From: {req.requester}</span>
            <span>Deadline: {req.deadline}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DesignerRequests;
