import { SupportItem } from '../types/impact.types';

export interface ImpactModel {
  totalMembers: number;
  totalFamilies: number;
  totalEvents: number;
  totalPayout: string;
  supports: SupportItem[];
}
