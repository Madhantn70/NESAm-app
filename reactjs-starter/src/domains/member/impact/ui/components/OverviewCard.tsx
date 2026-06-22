import React from 'react';

interface OverviewCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, subtitle }) => {
  return (
    <div className="bg-white rounded-[16px] px-4 py-4 flex flex-col gap-1 shadow-sm">
      <span className="text-[12px] font-semibold text-gray-500">{title}</span>
      <span className="text-[28px] font-extrabold text-[#1A1A1A] leading-snug">{value}</span>
      <span className="text-[12px] text-gray-400">{subtitle}</span>
    </div>
  );
};
