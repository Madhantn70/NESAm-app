import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical } from 'lucide-react';

export const ProfileHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between w-full py-4 px-3">
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate('/member/home')}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors duration-200"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
        </button>
        <h1 className="text-[18px] font-bold text-[#1A1A1A] tracking-tight leading-none">
          Profile
        </h1>
      </div>
      <button
        onClick={() => alert('Coming Soon')}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors duration-200"
        aria-label="More options"
      >
        <MoreVertical className="w-5 h-5 text-[#0A5F5F]" />
      </button>
    </div>
  );
};
