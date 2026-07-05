import { getStatusColor } from '../../utils/helpers';

const StatusBadge = ({ status }) => {
  const colors = getStatusColor(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide border h-[24px] select-none ${colors.bg} ${colors.text} ${colors.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
