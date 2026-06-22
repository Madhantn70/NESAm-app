import React from 'react';
import { useActiveDfcViewModel } from '../../application/viewmodels/useActiveDfcViewModel';
import { DfcHeader } from '../components/DfcHeader';
import { DfcDetailsCard } from '../components/DfcDetailsCard';
import { CommunityProgressCard } from '../components/CommunityProgressCard';
import { InfoBanner } from '../components/InfoBanner';
import { ActionButtons } from '../components/ActionButtons';
import { ContributionCard } from '../components/ContributionCard';
import { Header } from '../../../dashboard/ui/components/Header';

export const MemberActiveDfcPage: React.FC = () => {
  const { dfc } = useActiveDfcViewModel();

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#FAF9F8] mx-auto relative shadow-2xl overflow-x-hidden font-sans flex flex-col">

      {/* Logo Header */}
      <div className="w-full bg-white shadow-sm">
        <Header />
      </div>

      {/* Page Header */}
      <div className="z-20">
        <DfcHeader />
      </div>

      {/* Scrollable content — each section is its own card with 20px gap */}
      <div className="flex flex-col px-4 pt-5 pb-10" style={{ gap: '20px' }}>

        {/* 1. DFC Details Card */}
        <DfcDetailsCard dfc={dfc} />

        {/* 2. Community Progress Card */}
        <CommunityProgressCard dfc={dfc} />

        {/* 3. Info Banner */}
        <InfoBanner membersContributed={dfc.membersContributed} />

        {/* 4. Action Buttons + footer note */}
        <ActionButtons />

        {/* 5. Bottom dignity card */}
        <ContributionCard />

      </div>
    </div>
  );
};

export default MemberActiveDfcPage;
