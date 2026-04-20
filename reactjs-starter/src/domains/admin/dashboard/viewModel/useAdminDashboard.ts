import { AdminDashboardData } from '../model/AdminDashboard';

export const useAdminDashboard = (): { data: AdminDashboardData, isLoading: boolean } => {
  const data: AdminDashboardData = {
    stats: [
      { id: '1', title: 'New Members', value: 12, label: 'Pending Approval', icon: 'UserPlus' },
      { id: '2', title: 'Offline Payments', value: 8, label: 'Pending Verification', icon: 'CreditCard' },
      { id: '3', title: 'Active DFC', value: 3, label: 'Events Running', icon: 'Calendar' },
      { id: '4', title: 'Overdue', value: 15, label: 'Contributions', icon: 'AlertTriangle' },
    ],
    events: [
      {
        id: '1',
        title: 'Late Shri Ramesh Sharma',
        batch: 'Batch 1985',
        dueDate: 'Mar 30, 2026',
        collectedAmount: '₹71k',
        pendingCount: 28,
      },
      {
        id: '2',
        title: 'Late Smt. Priya Verma',
        batch: 'Batch 1992',
        dueDate: 'Apr 5, 2026',
        collectedAmount: '₹65k',
        pendingCount: 35,
      },
      {
        id: '3',
        title: 'Late Shri Anil Kumar',
        batch: 'Batch 1988',
        dueDate: 'Apr 12, 2026',
        collectedAmount: '₹58k',
        pendingCount: 42,
      },
    ],
  };

  return { data, isLoading: false };
};
