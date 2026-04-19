import React from 'react';

interface SectionHeaderProps {
  left: string;
  right: string;
  rightTeal?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ left, right, rightTeal }) => (
  <div className="flex items-center justify-between px-1">
    <span className="text-[11px] font-bold text-[#0A5F5F] uppercase tracking-widest">
      {left}
    </span>
    <span
      className={`text-[11px] font-semibold uppercase tracking-wide ${
        rightTeal ? 'text-[#0A5F5F]' : 'text-gray-400'
      }`}
    >
      {right}
    </span>
  </div>
);
