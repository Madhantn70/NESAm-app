import React, { useState } from 'react';

const TABS = ['Overview', 'Trends', 'Batch', 'Closed'] as const;

export const OverviewTabs: React.FC = () => {
  const [active, setActive] = useState<string>('Overview');

  return (
    <div className="flex bg-gray-100 rounded-[12px] p-1 gap-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`flex-1 py-1.5 rounded-[10px] text-[12px] font-semibold transition-all duration-200 ${
            active === tab
              ? 'bg-white text-[#0A5F5F] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
