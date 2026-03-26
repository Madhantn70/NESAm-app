import { AdminDashboardData } from "../models/api/admin";

export const mockAdminDashboardData: AdminDashboardData = {
  metrics: {
    newMembersPending: 12,
    offlinePaymentsPending: 8,
    activeDfcCount: 3,
    overdueContributions: 15
  },
  events: [
    {
      id: "dfc-001",
      deceasedName: "Late Shri Ramesh Sharma",
      batchYear: 1985,
      dueDate: "Mar 30, 2026",
      collectedAmount: 71000,
      pendingMembers: 28
    },
    {
      id: "dfc-002",
      deceasedName: "Late Smt. Priya Verma",
      batchYear: 1992,
      dueDate: "Apr 5, 2026",
      collectedAmount: 65000,
      pendingMembers: 35
    },
    {
      id: "dfc-003",
      deceasedName: "Late Shri Anil Kumar",
      batchYear: 1988,
      dueDate: "Apr 12, 2026",
      collectedAmount: 58000,
      pendingMembers: 42
    }
  ]
};

export const getMockAdminDashboard = async (): Promise<AdminDashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAdminDashboardData), 500);
  });
};
