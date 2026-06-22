import React from 'react';
import { Users } from 'lucide-react';
import { ActiveDfcModel } from '../../domain/models/active-dfc.model';

interface CommunityProgressCardProps {
  dfc: ActiveDfcModel;
}

export const CommunityProgressCard: React.FC<CommunityProgressCardProps> = ({ dfc }) => {
  return (
    <div className="bg-white rounded-[16px] p-4 shadow-sm flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#E8F4F4] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-[#0A5F5F]" />
        </div>
        <span className="text-[17px] font-bold text-[#1A1A1A]">Community Progress</span>
      </div>

      {/* Description */}
      <p className="text-[13px] text-gray-500 leading-relaxed -mt-2">
        See how our community is coming together to support this family
      </p>

      {/* Stats rows */}
      <div className="flex flex-col gap-0 rounded-[12px] border border-gray-100 overflow-hidden">
        {/* Members Contributed */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-gray-100">
          <span className="text-[13px] text-gray-500">Members Contributed</span>
          <span className="text-[22px] font-extrabold text-[#1A1A1A]">{dfc.membersContributed}</span>
        </div>
        {/* Members Pending */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white">
          <span className="text-[13px] text-gray-500">Members Pending</span>
          <span className="text-[22px] font-extrabold text-[#1A1A1A]">{dfc.membersPending}</span>
        </div>
      </div>

      {/* View Event Summary — outline button */}
      <button onClick={() => alert('Coming Soon')} className="w-full border border-[#0A5F5F] rounded-[12px] py-3 text-[14px] font-semibold text-[#0A5F5F] bg-white hover:bg-[#E8F4F4] transition-colors duration-200">
        View Event Summary
      </button>

    </div>
  );
};
