import React from 'react';
import { DashboardModel } from '../../domain/models/dashboard.model';

interface ProfileCardProps {
  data: DashboardModel;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ data }) => {
  const initials = data.memberName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4"
      style={{ border: '1px solid #E5E7EB', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>

      {/* Top row: avatar + info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center text-[22px] font-bold text-[#0A5F5F] shrink-0"
          style={{ background: '#C9C0B8' }}>
          {initials}
        </div>

        {/* Name + ID */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[19px] font-bold text-[#1A1A1A] leading-tight">{data.memberName}</span>
            {/* Filled green checkmark */}
            <span className="inline-flex items-center justify-center w-[20px] h-[20px] rounded-full bg-[#22C55E]">
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {data.isFounding && (
              <span className="bg-[#FDDCBB] text-[#8C4A00] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Founding
              </span>
            )}
          </div>
          <span className="text-[14px] text-gray-500">{data.nesamId}</span>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* BRANCH / BATCH / AGE — aligned under name column */}
      <div className="flex gap-4">
        {/* Spacer matching avatar */}
        <div className="w-[20px] shrink-0" />
        <div className="flex gap-8">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Branch</span>
            <span className="text-[16px] font-bold text-[#1A1A1A]">{data.branch}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Batch</span>
            <span className="text-[16px] font-bold text-[#1A1A1A]">{data.batch}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Age</span>
            <span className="text-[16px] font-bold text-[#1A1A1A]">{data.age} yrs</span>
          </div>
        </div>
      </div>

    </div>
  );
};
