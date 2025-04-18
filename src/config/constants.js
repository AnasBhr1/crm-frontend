// Base API URL - Should be environment variable in production
export const API_URL = 'http://localhost:5000';

// Lead status options
export const LEAD_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED'
};

export const LEAD_STATUS_COLORS = {
  PENDING: 'badge-pending',
  IN_PROGRESS: 'badge-in-progress',
  COMPLETED: 'badge-completed',
  CANCELED: 'badge-canceled'
};

export const LEAD_STATUS_LABELS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled'
};