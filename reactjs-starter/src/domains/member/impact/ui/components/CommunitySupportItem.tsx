import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SupportItem } from '../../domain/types/impact.types';

interface CommunitySupportItemProps {
  item: SupportItem;
}

export const CommunitySupportItem: React.FC<CommunitySupportItemProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-[16px] px-4 py-4 flex flex-col gap-2 shadow-sm">
      {/* Top row: Batch Year | Event Year */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Batch Year</span>
          <span className="text-[13px] font-semibold text-[#1A1A1A]">{item.batchYear}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Event Year</span>
          <span className="text-[13px] font-semibold text-[#1A1A1A]">{item.eventYear}</span>
        </div>
      </div>

      {/* Amount range */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Support Amount Range</span>
        <span className="text-[18px] font-extrabold text-[#0A5F5F] leading-snug">{item.amountRange}</span>
      </div>

      {/* Footer dignity line */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#0A5F5F] shrink-0" />
        <span className="text-[11px] text-gray-500">Supported with dignity by NESAm community</span>
      </div>
    </div>
  );
};
