import { ImpactModel } from '../../domain/models/impact.model';

export const mockImpactData: ImpactModel = {
  totalMembers: 1450,
  totalFamilies: 156,
  totalEvents: 156,
  totalPayout: '₹42.6L',
  supports: [
    { id: '1', batchYear: 1985, eventYear: 2026, amountRange: '₹70,000 - ₹80,000' },
    { id: '2', batchYear: 1992, eventYear: 2026, amountRange: '₹85,000 - ₹95,000' },
    { id: '3', batchYear: 1988, eventYear: 2025, amountRange: '₹65,000 - ₹75,000' },
    { id: '4', batchYear: 1996, eventYear: 2025, amountRange: '₹75,000 - ₹85,000' },
    { id: '5', batchYear: 1990, eventYear: 2025, amountRange: '₹80,000 - ₹90,000' },
  ],
};
