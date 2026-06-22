import React from 'react';
import { useEditProfileViewModel } from '../../application/viewmodels/useEditProfileViewModel';
import { Header } from '../../../dashboard/ui/components/Header';
import { EditProfileHeader } from '../components/EditProfileHeader';
import { ProfilePhotoUploader } from '../components/ProfilePhotoUploader';
import { PersonalInfoForm } from '../components/PersonalInfoForm';
import { ContactDetailsForm } from '../components/ContactDetailsForm';
import { UpdateButton } from '../components/UpdateButton';

export const MemberEditProfilePage: React.FC = () => {
  const { profile } = useEditProfileViewModel();

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#FAF9F8] mx-auto relative shadow-2xl overflow-x-hidden font-sans flex flex-col">

      {/* Logo Header */}
      <div className="w-full bg-white shadow-sm">
        <Header />
      </div>

      {/* Page Header — back arrow + "Edit Profile" + "Save" */}
      <div>
        <EditProfileHeader />
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col px-4 pb-12" style={{ gap: '20px' }}>

        {/* 1. Profile Photo */}
        <ProfilePhotoUploader />

        {/* 2. Personal Information — locked fields */}
        <PersonalInfoForm
          name={profile.name}
          dob={profile.dob}
          graduationYear={profile.graduationYear}
        />

        {/* 3. Contact Details — editable fields */}
        <ContactDetailsForm
          email={profile.email}
          mobile={profile.mobile}
          address={profile.address}
        />

        {/* 4. Update Profile + Discard Changes */}
        <UpdateButton />

      </div>
    </div>
  );
};

export default MemberEditProfilePage;
