import React from 'react';
import { SupportItem } from '../../domain/types/impact.types';
import { CommunitySupportItem } from './CommunitySupportItem';
import { ShieldCheck } from 'lucide-react';

interface CommunitySupportListProps {
  supports: SupportItem[];
}

export const CommunitySupportList: React.FC<CommunitySupportListProps> = ({ supports }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Section heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[16px] font-bold text-[#1A1A1A]">Recent Community Support</h2>
        <p className="text-[12px] text-gray-500 leading-relaxed">
          Recent support events completed with dignity and care. All information is anonymized to
          protect privacy.
        </p>
      </div>

      {/* Support cards */}
      <div className="flex flex-col gap-4">
        {supports.map((item) => (
          <CommunitySupportItem key={item.id} item={item} />
        ))}
      </div>

      {/* Privacy notice */}
      <div className="flex items-center justify-center gap-1.5 py-2">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[11px] text-gray-400 text-center">
          No personal or identifying information is shared
        </span>
      </div>
    </div>
  );
};
