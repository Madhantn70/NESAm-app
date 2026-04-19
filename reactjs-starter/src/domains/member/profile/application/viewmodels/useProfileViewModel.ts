import { ProfileModel } from '../../domain/models/profile.model';
import { mockProfile } from '../../infrastructure/mocks/profile.mock';

interface ProfileViewModel {
  profile: ProfileModel;
}

export const useProfileViewModel = (): ProfileViewModel => {
  return { profile: mockProfile };
};
