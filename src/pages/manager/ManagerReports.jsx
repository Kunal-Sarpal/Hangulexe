import Icons from '../../components/Icons';
import Breadcrumb from '../../components/ui/Breadcrumb';

const ManagerReports = ({ navigateTo }) => (
  <div className="space-y-5 animate-fade-in">
    <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
    <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Reports</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { title: 'Sales Report', desc: 'Revenue breakdown by day, week, month', icon: <Icons.Reports />, color: 'from-blue-500 to-indigo-600' },
        { title: 'Inventory Report', desc: 'Stock levels, low stock alerts, movement', icon: <Icons.Inventory />, color: 'from-emerald-500 to-teal-600' },
        { title: 'Staff Performance', desc: 'Attendance, sales per receptionist', icon: <Icons.Staff />, color: 'from-purple-500 to-pink-600' },
        { title: 'Coupon Analysis', desc: 'Usage rates, revenue impact', icon: <Icons.Coupon />, color: 'from-amber-500 to-orange-600' },
        { title: 'Customer Insights', desc: 'Repeat customers, top spenders', icon: <Icons.Walkin />, color: 'from-pink-500 to-rose-600' },
        { title: 'GST Summary', desc: 'Tax collected, filed status', icon: <Icons.GST />, color: 'from-slate-600 to-slate-800' },
      ].map((r, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/50 p-5 hover:card-shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
            {r.icon}
          </div>
          <h3 className="font-bold text-slate-900">{r.title}</h3>
          <p className="text-xs text-slate-500 mt-1">{r.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ManagerReports;
