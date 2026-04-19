import { ActiveDfcModel } from '../../domain/models/active-dfc.model';
import { mockActiveDfc } from '../../infrastructure/mocks/active-dfc.mock';

export const useActiveDfcViewModel = (): { dfc: ActiveDfcModel } => {
  return {
    dfc: mockActiveDfc,
  };
};
