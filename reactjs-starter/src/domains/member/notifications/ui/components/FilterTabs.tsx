import React, { useState } from 'react';

const TABS = ['All', 'Read', 'Unread'] as const;

export const FilterTabs: React.FC = () => {
  const [active, setActive] = useState<string>('All');

  return (
    <div className="flex gap-2">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
            active === tab
              ? 'bg-[#0A5F5F] text-white shadow-sm'
              : 'bg-[#EDEDED] text-gray-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
