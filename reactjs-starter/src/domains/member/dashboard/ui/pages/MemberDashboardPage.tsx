import React from 'react';
import { useDashboardViewModel } from '../../application/viewmodels/useDashboardViewModel';
import { Header } from '../components/Header';
import { ProfileCard } from '../components/ProfileCard';
import { QuickAccess } from '../components/QuickAccess';
import { DfcCard } from '../components/DfcCard';
import { StatsCard } from '../components/StatsCard';
import { ImpactCard } from '../components/ImpactCard';
import { BottomNavBar } from '../components/BottomNavBar';

export const MemberDashboardPage: React.FC = () => {
  const { dashboard, loading } = useDashboardViewModel();

  if (loading || !dashboard) {
    return (
      <div className="w-full max-w-[412px] min-h-screen bg-[#FAF9F6] mx-auto flex items-center justify-center">
        <span className="text-gray-500">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#FAF9F6] mx-auto relative shadow-2xl overflow-x-hidden font-sans flex flex-col">
      {/* Header Container */}
      <div className="w-full bg-white shadow-sm z-20 rounded-b-lg">
        <Header showTitle={true} />
      </div>

      <div className="flex flex-col flex-1 px-[16px] pt-[24px] pb-[128px] gap-[24px]">
        {/* Welcome Text */}
        <h1 className="text-[22px] font-bold text-[#0A5F5F] tracking-tight leading-snug capitalize">
          Welcome Back {dashboard.memberName}!
        </h1>

        <ProfileCard data={dashboard} />
        <QuickAccess />
        <DfcCard data={dashboard} />
        <StatsCard data={dashboard} />
        <ImpactCard data={dashboard} />
      </div>

      <BottomNavBar />
    </div>
  );
};

export default MemberDashboardPage;
