import React from 'react';
import { Pencil } from 'lucide-react';

export const ProfilePhotoUploader: React.FC = () => (
  <div className="flex flex-col items-center gap-2 py-2">
    {/* Avatar with edit icon overlay */}
    <div className="relative">
      <div className="w-[80px] h-[80px] rounded-full bg-gray-100 border-2 border-gray-200" />
      {/* Teal pencil badge */}
      <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0A5F5F] flex items-center justify-center border-2 border-white">
        <Pencil className="w-3 h-3 text-white" />
      </div>
    </div>
    <span className="text-[13px] text-[#6A7171]">Update profile photo</span>
  </div>
);
