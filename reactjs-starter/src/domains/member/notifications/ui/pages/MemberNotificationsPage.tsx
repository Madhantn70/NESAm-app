import React from 'react';
import { useNotificationsViewModel } from '../../application/viewmodels/useNotificationsViewModel';
import { Header } from '../../../dashboard/ui/components/Header';
import { NotificationsHeader } from '../components/NotificationsHeader';
import { FilterTabs } from '../components/FilterTabs';
import { SectionHeader } from '../components/SectionHeader';
import { NotificationCard } from '../components/NotificationCard';
import { DfcHistoryCard } from '../components/DfcHistoryCard';

export const MemberNotificationsPage: React.FC = () => {
  const { notifications, dfcHistory } = useNotificationsViewModel();

  return (
    <div className="w-full max-w-[412px] min-h-screen bg-[#FAF9F8] mx-auto relative shadow-2xl overflow-x-hidden font-sans flex flex-col">

      {/* Logo Header */}
      <div className="w-full bg-white shadow-sm">
        <Header />
      </div>

      {/* Page Header — sits on background */}
      <div>
        <NotificationsHeader />
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col px-4 pb-10" style={{ gap: '20px' }}>

        {/* 1. Filter Tabs */}
        <FilterTabs />

        {/* 2. Requires Action section */}
        <div className="flex flex-col" style={{ gap: '16px' }}>
          <SectionHeader
            left="Requires Action"
            right={`${notifications.length} Items`}
          />
          {notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))}
        </div>

        {/* 3. Recent DFC's section */}
        <div className="flex flex-col" style={{ gap: '16px' }}>
          <SectionHeader
            left="Recent DFC's"
            right="View All"
            rightTeal
          />
          {dfcHistory.map((item) => (
            <DfcHistoryCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default MemberNotificationsPage;
