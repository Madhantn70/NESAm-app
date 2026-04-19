import React from 'react';
import { Home, Users, Wallet, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WalletBottomNavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 w-full max-w-[412px] bg-white/95 backdrop-blur-md pb-6 pt-3 px-6 shadow-[0_-4px_30px_rgba(0,0,0,0.04)] rounded-t-[24px] border-t border-[#B0B3AE]/15 flex justify-between items-center z-50 left-1/2 -translate-x-1/2">

      {/* Home */}
      <div
        className="flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => navigate('/member/home')}
      >
        <div className="w-[56px] h-[32px] flex items-center justify-center">
          <Home className="w-6 h-6 text-[#889B9B]" />
        </div>
        <span className="text-[11px] font-semibold text-[#889B9B]">Home</span>
      </div>

      {/* Impacts */}
      <div
        className="flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => navigate('/member/impact')}
      >
        <div className="w-[56px] h-[32px] flex items-center justify-center">
          <Users className="w-6 h-6 text-[#889B9B]" />
        </div>
        <span className="text-[11px] font-semibold text-[#889B9B]">Impacts</span>
      </div>

      {/* Wallet (Active) */}
      <div className="flex flex-col items-center gap-1 cursor-pointer">
        <div className="w-[56px] h-[32px] bg-[#9CEBE2] rounded-2xl flex items-center justify-center">
          <Wallet className="w-5 h-5 text-[#0A5F5F] fill-[#0A5F5F]" />
        </div>
        <span className="text-[11px] font-bold text-[#0A5F5F]">Wallet</span>
      </div>

      {/* Profile */}
      <div
        className="flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => navigate('/member/profile')}
      >
        <div className="w-[56px] h-[32px] flex items-center justify-center">
          <User className="w-6 h-6 text-[#889B9B]" />
        </div>
        <span className="text-[11px] font-semibold text-[#889B9B]">Profile</span>
      </div>

    </div>
  );
};
