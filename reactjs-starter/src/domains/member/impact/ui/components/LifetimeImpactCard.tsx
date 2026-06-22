import React from 'react';
import { Users, Heart, CalendarDays, IndianRupee } from 'lucide-react';

interface LifetimeImpactCardProps {
  totalMembers: number;
  totalFamilies: number;
  totalEvents: number;
  totalPayout: string;
}

interface StatMiniCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const StatMiniCard: React.FC<StatMiniCardProps> = ({ icon, value, label }) => (
  <div className="bg-[#FFF4E6] rounded-[12px] p-3 flex flex-col items-center justify-center gap-1.5">
    <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-[22px] font-extrabold text-[#1A1A1A] leading-none">{value}</span>
    <span className="text-[11px] font-medium text-gray-600">{label}</span>
  </div>
);

export const LifetimeImpactCard: React.FC<LifetimeImpactCardProps> = ({
  totalMembers,
  totalFamilies,
  totalEvents,
  totalPayout,
}) => {
  return (
    <div className="bg-white rounded-[16px] p-4 shadow-sm">
      <h2 className="text-[15px] font-bold text-[#1A1A1A] text-center mb-3">Lifetime Impact</h2>
      <div className="grid grid-cols-2 gap-3">
        <StatMiniCard
          icon={<Users className="w-4 h-4 text-[#0A5F5F]" />}
          value={totalMembers.toLocaleString('en-IN')}
          label="Members"
        />
        <StatMiniCard
          icon={<Heart className="w-4 h-4 text-[#0A5F5F]" />}
          value={totalFamilies}
          label="Families"
        />
        <StatMiniCard
          icon={<CalendarDays className="w-4 h-4 text-[#0A5F5F]" />}
          value={totalEvents}
          label="Events"
        />
        <StatMiniCard
          icon={<IndianRupee className="w-4 h-4 text-[#2E7D32]" />}
          value={totalPayout}
          label="Payout"
        />
      </div>
    </div>
  );
};
