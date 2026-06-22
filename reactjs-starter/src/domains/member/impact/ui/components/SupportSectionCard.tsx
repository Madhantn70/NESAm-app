import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { SupportItem } from '../../domain/types/impact.types';
import { SupportItemCard } from './SupportItemCard';

interface SupportSectionCardProps {
  supports: SupportItem[];
}

export const SupportSectionCard: React.FC<SupportSectionCardProps> = ({ supports }) => {
  return (
    <div className="bg-white rounded-[16px] p-4 shadow-sm flex flex-col gap-4">
      {/* Section header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[15px] font-bold text-[#1A1A1A]">Recent Community Support</h2>
        <p className="text-[12px] text-gray-500 leading-relaxed">
          Recent support events completed with dignity and care. All information is anonymized to
          protect privacy.
        </p>
      </div>

      {/* Support item cards — each one independent */}
      <div className="flex flex-col gap-3">
        {supports.map((item) => (
          <SupportItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Privacy notice */}
      <div className="flex items-center justify-center gap-1.5 pt-1 border-t border-[#F0ECE6]">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-[11px] text-gray-400">
          No personal or identifying information is shared
        </span>
      </div>
    </div>
  );
};
