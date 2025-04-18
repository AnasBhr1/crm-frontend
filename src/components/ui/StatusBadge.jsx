import React from 'react';
import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from '../../config/constants';
import { Check, Clock, Ban } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'IN_PROGRESS':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'COMPLETED':
        return <Check className="h-3 w-3 mr-1" />;
      case 'CANCELED':
        return <Ban className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`badge ${LEAD_STATUS_COLORS[status]} flex items-center`}>
      {getStatusIcon()}
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
};

export default StatusBadge;