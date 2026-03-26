export interface AdminMetricsResponse {
  newMembersPending: number;
  offlinePaymentsPending: number;
  activeDfcCount: number;
  overdueContributions: number;
}

export interface AdminActiveDfcEvent {
  id: string;
  deceasedName: string;
  batchYear: number;
  dueDate: string;
  collectedAmount: number;
  pendingMembers: number;
}

export interface AdminDashboardData {
  metrics: AdminMetricsResponse;
  events: AdminActiveDfcEvent[];
}
