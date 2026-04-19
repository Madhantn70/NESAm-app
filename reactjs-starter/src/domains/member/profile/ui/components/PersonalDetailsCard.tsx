import React from 'react';
import { Lock } from 'lucide-react';

interface PersonalDetailsCardProps {
  dob: string;
  graduationYear: string;
}

export const PersonalDetailsCard: React.FC<PersonalDetailsCardProps> = ({
  dob,
  graduationYear,
}) => (
  <div className="flex flex-col gap-2">
    {/* Section label */}
    <span className="text-[11px] font-bold text-[#6A7171] uppercase tracking-widest px-1">
      Personal Details
    </span>

    <div className="bg-white rounded-[16px] overflow-hidden">
      {/* Date of Birth */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-[#6A7171] uppercase tracking-wide">
            Date of Birth
          </span>
          <span className="text-[15px] font-semibold text-[#1A1A1A]">{dob}</span>
        </div>
        <Lock className="w-4 h-4 text-[#6A7171]" />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Graduation Year */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-[#6A7171] uppercase tracking-wide">
            Graduation Year
          </span>
          <span className="text-[15px] font-semibold text-[#1A1A1A]">{graduationYear}</span>
        </div>
        <Lock className="w-4 h-4 text-[#6A7171]" />
      </div>
    </div>
  </div>
);
