import React from 'react';

interface MembershipInfoCardProps {
  membershipType: string;
  memberId: string;
}

export const MembershipInfoCard: React.FC<MembershipInfoCardProps> = ({
  membershipType,
  memberId,
}) => (
  <div className="flex flex-col gap-2">
    {/* Section label */}
    <span className="text-[11px] font-bold text-[#6A7171] uppercase tracking-widest px-1">
      Membership Info
    </span>

    {/* Two side-by-side info tiles */}
    <div className="bg-white rounded-[16px] p-4 flex gap-3">
      {/* Membership Type */}
      <div className="flex-1 bg-[#F7F5F2] rounded-[12px] px-3 py-3 flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-[#6A7171] uppercase tracking-wide">
          Membership Type
        </span>
        <span className="text-[14px] font-bold text-[#0A5F5F]">{membershipType}</span>
      </div>

      {/* Member ID */}
      <div className="flex-1 bg-[#F7F5F2] rounded-[12px] px-3 py-3 flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-[#6A7171] uppercase tracking-wide">
          Member ID
        </span>
        <span className="text-[14px] font-bold text-[#1A1A1A]">{memberId}</span>
      </div>
    </div>
  </div>
);
