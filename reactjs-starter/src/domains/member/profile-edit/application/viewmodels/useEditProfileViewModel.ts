import { EditProfileModel } from '../../domain/models/edit-profile.model';
import { mockEditProfile } from '../../infrastructure/mocks/edit-profile.mock';

interface EditProfileViewModel {
  profile: EditProfileModel;
}

export const useEditProfileViewModel = (): EditProfileViewModel => {
  return { profile: mockEditProfile };
};
