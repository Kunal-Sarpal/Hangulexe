import Breadcrumb from '../../components/ui/Breadcrumb';

const ReceptionistFeedback = ({ navigateTo, showToast }) => {
  const feedbacks = [
    { customer: 'Anjali Mehta', rating: 5, comment: 'Amazing collection! The staff was very helpful with my bridal lehenga selection.', date: '27 Jun 2025' },
    { customer: 'Karan Singh', rating: 4, comment: 'Good variety of formals. Would love to see more slim-fit options.', date: '27 Jun 2025' },
    { customer: 'Priya Nair', rating: 5, comment: 'Quick pickup, everything was packed perfectly. Will visit again!', date: '26 Jun 2025' },
    { customer: 'Deepak Gupta', rating: 3, comment: 'The return process could be smoother. Had to wait for 20 minutes.', date: '26 Jun 2025' },
    { customer: 'Simran Kaur', rating: 4, comment: 'Loved the new summer collection. Great prices for the quality.', date: '25 Jun 2025' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Customer Feedback</h2>
      <div className="space-y-4">
        {feedbacks.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/50 p-5 card-shadow hover:card-shadow-lg transition-all animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {f.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{f.customer}</h3>
                  <p className="text-xs text-slate-400">{f.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, idx) => (
                  <svg key={idx} className={`w-4 h-4 ${idx < f.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{f.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceptionistFeedback;
