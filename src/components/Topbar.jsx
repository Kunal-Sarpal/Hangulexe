const Topbar = ({ user, rc }) => (
  <header className="topbar">
    <div className="flex items-center gap-3">
      <h1 className="text-[16px] font-bold text-[#111827] tracking-tight">Fashion Co Admin</h1>
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${rc.light} ${rc.text} ${rc.border}`}>
        {user.role}
      </span>
    </div>
    <div className="flex items-center gap-4">
      {/* Notification bell */}
      <button className="w-9 h-9 rounded-[10px] hover:bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] hover:text-[#111827] transition-all relative cursor-pointer">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-[#EF4444] rounded-full border border-white" />
      </button>
      
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-[10px] bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white text-[11px] font-bold`} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {user.initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-[13px] font-bold text-[#111827] leading-none">{user.name}</p>
          <p className="text-[11px] text-[#6B7280] mt-1 leading-none">{user.email}</p>
        </div>
      </div>
    </div>
  </header>
);

export default Topbar;
