import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SupportItem } from '../../domain/types/impact.types';

interface SupportItemCardProps {
  item: SupportItem;
}

export const SupportItemCard: React.FC<SupportItemCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-[14px] px-4 py-3.5 flex flex-col gap-2.5 border border-[#E0DDD8]">
      {/* Top row: Batch Year | Event Year */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Batch Year
          </span>
          <span className="text-[14px] font-bold text-[#1A1A1A]">{item.batchYear}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Event Year
          </span>
          <span className="text-[14px] font-bold text-[#1A1A1A]">{item.eventYear}</span>
        </div>
      </div>

      {/* Amount Range */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Support Amount Range
        </span>
        <span className="text-[18px] font-extrabold text-[#0A5F5F] leading-snug">
          {item.amountRange}
        </span>
      </div>

      {/* Dignity footer */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-[#F0ECE6]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#0A5F5F] shrink-0" />
        <span className="text-[11px] text-gray-500 leading-tight">
          Supported with dignity by NESAm community
        </span>
      </div>
    </div>
  );
};
