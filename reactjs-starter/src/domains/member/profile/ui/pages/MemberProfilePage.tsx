import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileViewModel } from '../../application/viewmodels/useProfileViewModel';
import { Header } from '../../../dashboard/ui/components/Header';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { MembershipInfoCard } from '../components/MembershipInfoCard';
import { PersonalDetailsCard } from '../components/PersonalDetailsCard';
import { ContactDetailsCard } from '../components/ContactDetailsCard';
import { LogoutButton } from '../components/LogoutButton';

export const MemberProfilePage: React.FC = () => {
  const { profile } = useProfileViewModel();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#FAF9F8] mx-auto relative shadow-2xl overflow-x-hidden font-sans flex flex-col">

      {/* Logo Header */}
      <div className="w-full bg-white shadow-sm">
        <Header />
      </div>

      {/* Page Header — back arrow + "Profile" + 3-dot menu */}
      <div>
        <ProfileHeader />
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col px-4 pb-12" style={{ gap: '20px' }}>

        {/* 1. Avatar + Status + Name + Joined */}
        <ProfileAvatar
          name={profile.name}
          status={profile.membershipStatus}
          joinedDate={profile.joinedDate}
        />

        {/* 2. Edit Profile button */}
        <button
          onClick={() => navigate('/member/profile/edit')}
          className="w-full bg-[#0A5F5F] hover:bg-[#084F4F] text-white rounded-full py-4 text-[15px] font-semibold tracking-wide transition-colors duration-200 shadow-[0_4px_14px_rgba(10,95,95,0.25)]"
        >
          Edit Profile
        </button>

        {/* 3. Membership Info */}
        <MembershipInfoCard
          membershipType={profile.membershipType}
          memberId={profile.memberId}
        />

        {/* 4. Personal Details */}
        <PersonalDetailsCard
          dob={profile.dob}
          graduationYear={profile.graduationYear}
        />

        {/* 5. Contact Details */}
        <ContactDetailsCard
          email={profile.email}
          mobile={profile.mobile}
          address={profile.address}
        />

        {/* 6. Logout */}
        <LogoutButton />

      </div>
    </div>
  );
};

export default MemberProfilePage;
