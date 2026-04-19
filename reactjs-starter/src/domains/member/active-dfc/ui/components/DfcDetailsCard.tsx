import React from 'react';
import { Clock } from 'lucide-react';
import { ActiveDfcModel } from '../../domain/models/active-dfc.model';

interface DfcDetailsCardProps {
  dfc: ActiveDfcModel;
}

export const DfcDetailsCard: React.FC<DfcDetailsCardProps> = ({ dfc }) => {
  return (
    <div className="bg-white rounded-[16px] p-4 shadow-sm flex flex-col gap-0">

      {/* Section 1: For / Name / Batch */}
      <div className="bg-[#F7F5F2] rounded-[12px] px-4 py-3 flex flex-col gap-1">
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">For</span>
        <span className="text-[16px] font-bold text-[#1A1A1A]">{dfc.deceasedName}</span>
        <span className="text-[13px] text-gray-500">{dfc.batch}</span>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-1 my-3" />

      {/* Section 2: Event Date */}
      <div className="flex items-start gap-3 px-1">
        <div className="w-9 h-9 rounded-full bg-[#E8F4F4] flex items-center justify-center shrink-0 mt-0.5">
          <Clock className="w-4 h-4 text-[#0A5F5F]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
            Event Initiated Date
          </span>
          <span className="text-[16px] font-bold text-[#1A1A1A]">{dfc.eventDate}</span>
          <span className="text-[12px] text-gray-500">{dfc.daysRemaining} days remaining</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-1 my-3" />

      {/* Section 3: Your Contribution */}
      <div className="bg-[#EBF4F4] rounded-[12px] px-4 py-3 flex items-center justify-between">
        <span className="text-[13px] font-medium text-gray-500">Your Contribution</span>
        <span className="text-[32px] font-extrabold text-[#0A5F5F] leading-none">
          ₹{dfc.contributionAmount}
        </span>
      </div>

    </div>
  );
};
