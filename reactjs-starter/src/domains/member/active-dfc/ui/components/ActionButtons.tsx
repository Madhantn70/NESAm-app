import React from 'react';

export const ActionButtons: React.FC = () => {
  return (
    <div className="flex flex-col gap-3">
      {/* Primary: Pay Securely Online */}
      <button onClick={() => alert('Coming Soon')} className="w-full bg-[#0A5F5F] hover:bg-[#084F4F] text-white rounded-[14px] py-4 text-[15px] font-semibold tracking-wide transition-colors duration-200 shadow-[0_4px_14px_rgba(10,95,95,0.30)]">
        Pay Securely Online
      </button>

      {/* Secondary: Remind Me Later */}
      <button onClick={() => alert('Coming Soon')} className="w-full border border-[#0A5F5F] text-[#0A5F5F] bg-white hover:bg-[#E8F4F4] rounded-[14px] py-4 text-[15px] font-semibold tracking-wide transition-colors duration-200">
        Remind Me Later
      </button>

      {/* Footer note */}
      <p className="text-center text-[11px] text-gray-400 leading-snug">
        Offline contribution options may be enabled in future.
      </p>
    </div>
  );
};
