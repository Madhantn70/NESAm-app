import { ImpactModel } from '../../domain/models/impact.model';
import { mockImpactData } from '../../infrastructure/mocks/impact.mock';

export const useImpactViewModel = (): { impact: ImpactModel } => {
  return {
    impact: mockImpactData,
  };
};
