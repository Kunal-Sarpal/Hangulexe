const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="stat-card">
    <div className="stat-card-content">
      <span className="stat-card-label">{title}</span>
      <span className="stat-card-value">{value}</span>
      {trend && <span className="stat-card-subtext">{trend}</span>}
    </div>
    <div className={`stat-card-icon-box bg-gradient-to-br ${color} text-white`}>
      {icon}
    </div>
  </div>
);

export default StatCard;
