import React from 'react';

interface InfoBannerProps {
  membersContributed: number;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ membersContributed }) => {
  return (
    <div className="bg-[#FEF3E8] rounded-[12px] px-4 py-3 text-center">
      <p className="text-[13px] text-[#1A1A1A] leading-relaxed">
        <span className="font-bold text-[#F28C38]">{membersContributed} members</span>{' '}
        have already contributed.{' '}
        <span className="font-semibold">Be part of this support.</span>
      </p>
    </div>
  );
};
