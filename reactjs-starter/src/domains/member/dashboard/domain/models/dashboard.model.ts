import { MembershipStatus } from '../types/membership-status.type';

export interface DashboardModel {
  memberName: string;
  nesamId: string;
  membershipStatus: MembershipStatus;
  isFounding: boolean;
  membershipType: string;
  branch: string;
  batch: number;
  age: number;
  securityDepositBalance: number;
  hasPendingDfc: boolean;
  contributionDueDate: string;
  familiesSupported: number;
  totalActiveMembers: number;
}
