export interface MemberDashboardSummaryRequest {}

export interface MemberDashboardSummaryResponse {
  memberName: string;
  memberSince: number;
  hasPendingDFC: boolean;
  familiesSupported: number;
  hasActiveDFC: boolean;
  activeDfcCount: number;
  status: string;
  membershipPaid: boolean;
  contributionDueDate?: string;
}

export interface MemberActiveDfcRequest {
  eventId: string;
}

export interface MemberActiveDfcResponse {
  dfcAmount: number;
  batchYear: number;
  eventInitiatedDate: string;
  deceasedName: string;
  membersContributed: number;
  membersPending: number;
}

export interface MemberImpactStatsRequest {
  batch?: string;
  department?: string;
}

export interface MemberImpactStatsResponse {
  totalMembers: number;
  familiesSupported: number;
  dfcEvents: number;
  totalPayoutLakhs: string;
  membershipGrowth: Array<{ id: string, year: string, members: number }>;
  dfcTrends: Array<{ id: string, year: string, collected: number, paid: number }>;
  batchImpact: Array<{ id: string, batch: string, families: number }>;
  closedEvents: Array<{ id: string, month: string, events: number, payout: number }>;
  recentSupport: Array<{ id: string, batch: string, year: number, amountRange: string }>;
}

export interface UserProfileResponse {
  userUuid: string;
  mobileNumber: string;
  fullName: string;
  email: string;
  irttaaId: string;
}
