import React from 'react';
import { useImpactViewModel } from '../../application/viewmodels/useImpactViewModel';
import { ImpactHeader } from '../components/ImpactHeader';
import { FilterCard } from '../components/FilterCard';
import { LifetimeImpactCard } from '../components/LifetimeImpactCard';
import { SupportSectionCard } from '../components/SupportSectionCard';
import { ProgramOverviewCard } from '../components/ProgramOverviewCard';
import { Header } from '../../../dashboard/ui/components/Header';

export const MemberImpactPage: React.FC = () => {
  const { impact } = useImpactViewModel();

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#FAF9F8] mx-auto relative shadow-2xl overflow-x-hidden font-sans flex flex-col">

      {/* Logo Header */}
      <div className="w-full bg-white shadow-sm">
        <Header />
      </div>

      {/* Page Header */}
      <div className="z-20">
        <ImpactHeader />
      </div>

      {/* Scrollable content: each section is a fully independent card */}
      <div className="flex flex-col px-4 pt-5 pb-[128px]" style={{ gap: '20px' }}>

        {/* 1. Filter Card */}
        <FilterCard />

        {/* 2. Lifetime Impact Card */}
        <LifetimeImpactCard
          totalMembers={impact.totalMembers}
          totalFamilies={impact.totalFamilies}
          totalEvents={impact.totalEvents}
          totalPayout={impact.totalPayout}
        />

        {/* 3. Recent Community Support Card */}
        <SupportSectionCard supports={impact.supports} />

        {/* 5. Program Overview Card (tabs live inside) */}
        <ProgramOverviewCard />

      </div>

    </div>
  );
};

export default MemberImpactPage;
