import React from 'react';
import { ImpactTabs } from './ImpactTabs';

interface OverviewMiniCardProps {
  label: string;
  value: string;
  subtext: string;
}

const OverviewMiniCard: React.FC<OverviewMiniCardProps> = ({ label, value, subtext }) => (
  <div className="bg-[#FFF4E6] rounded-[14px] px-4 py-4 flex flex-col" style={{ gap: '6px' }}>
    {/* Layer 1: Label — small, muted */}
    <span
      className="text-[12px] font-medium leading-none"
      style={{ color: '#6A7171' }}
    >
      {label}
    </span>

    {/* Layer 2: Value — large, bold, dark */}
    <span
      className="font-bold leading-tight"
      style={{ fontSize: '28px', color: '#0A5F5F', lineHeight: '1.1' }}
    >
      {value}
    </span>

    {/* Layer 3: Subtext — small, light */}
    <span
      className="text-[12px] leading-snug"
      style={{ color: '#9CA3AF' }}
    >
      {subtext}
    </span>
  </div>
);

export const ProgramOverviewCard: React.FC = () => {
  return (
    <div
      className="bg-white rounded-[16px] flex flex-col"
      style={{
        padding: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        gap: '12px',
      }}
    >
      {/* Tabs — live inside this card */}
      <ImpactTabs />

      {/* Title */}
      <h2
        className="font-bold text-[#1A1A1A]"
        style={{ fontSize: '16px', marginBottom: '0px' }}
      >
        Program Overview
      </h2>

      {/* Mini cards */}
      <OverviewMiniCard
        label="Membership Growth"
        value="1,450"
        subtext="Active members today"
      />
      <OverviewMiniCard
        label="DFC Collection Rate"
        value="100%"
        subtext="Collection vs payout transparency"
      />
      <OverviewMiniCard
        label="Community Impact"
        value="156 families"
        subtext="Supported with dignity"
      />
    </div>
  );
};
