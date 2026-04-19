import React from 'react';
import { CheckCircle } from 'lucide-react';

export const UpdateButton: React.FC = () => (
  <div className="flex flex-col items-center gap-3">
    <button onClick={() => alert('Coming Soon')} className="w-full bg-[#0A5F5F] hover:bg-[#084F4F] text-white rounded-full py-4 flex items-center justify-center gap-2 text-[15px] font-semibold tracking-wide transition-colors duration-200 shadow-[0_4px_14px_rgba(10,95,95,0.25)]">
      Update Profile
      <CheckCircle className="w-4 h-4 text-white" />
    </button>
    <button onClick={() => alert('Coming Soon')} className="text-[13px] text-[#6A7171] hover:text-[#1A1A1A] transition-colors duration-200">
      Discard Changes
    </button>
  </div>
);
