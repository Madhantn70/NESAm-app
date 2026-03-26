export interface ChartDataPoint {
  id: string;
  [key: string]: string | number;
}

export interface MemberImpactViewState {
  totalMembers: number;
  familiesSupported: number;
  dfcEvents: number;
  totalPayoutLakhs: string;
  membershipGrowth: ChartDataPoint[];
  dfcTrends: ChartDataPoint[];
  batchImpact: ChartDataPoint[];
  closedEvents: ChartDataPoint[];
  recentSupport: Array<{ id: string; batch: string; year: number; amountRange: string }>;
}
