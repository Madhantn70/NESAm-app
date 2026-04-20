export interface StatCard {
  id: string;
  value: number | string;
  label: string;
  title: string;
  icon?: string;
}

export interface DfcEvent {
  id: string;
  title: string;
  batch: string;
  dueDate: string;
  collectedAmount: string;
  pendingCount: number;
}

export interface AdminDashboardData {
  stats: StatCard[];
  events: DfcEvent[];
}
