import React from 'react';

interface ProfileAvatarProps {
  name: string;
  status: string;
  joinedDate: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ name, status, joinedDate }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar circle */}
      <div className="relative">
        <div className="w-[88px] h-[88px] rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
          <span className="text-[28px] font-bold text-gray-400">{initials}</span>
        </div>
        {/* ACTIVE badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1A7A4A] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase whitespace-nowrap">
          {status}
        </div>
      </div>

      {/* Name + joined */}
      <div className="flex flex-col items-center gap-0.5 mt-4">
        <span className="text-[22px] font-bold text-[#1A1A1A]">{name}</span>
        <span className="text-[13px] text-[#6A7171]">Joined {joinedDate}</span>
      </div>
    </div>
  );
};
