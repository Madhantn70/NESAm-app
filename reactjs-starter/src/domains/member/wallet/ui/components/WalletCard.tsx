import React from 'react';
import { Lock, Shield } from 'lucide-react';

interface WalletCardProps {
  securityDepositBalance: number;
}

export const WalletCard: React.FC<WalletCardProps> = ({ securityDepositBalance }) => {
  const formattedAmount = securityDepositBalance.toLocaleString('en-IN');

  return (
    <div
      className="rounded-[24px] p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #006A6A 0%, #008080 50%, #00A3A3 100%)',
      }}
    >
      {/* Background decorative circle */}
      <div
        className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10"
        style={{ background: 'white' }}
      />

      {/* Top row: label + lock icon */}
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-semibold text-white/70 tracking-widest uppercase">
          Locked DFC Amount
        </span>
        <div className="bg-white/20 rounded-xl p-2">
          <Lock className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Amount */}
      <div className="mt-2 mb-5">
        <span className="text-[40px] font-bold text-white leading-none">
          ₹{formattedAmount}
        </span>
      </div>

      {/* Pill */}
      <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5">
        <Shield className="w-3.5 h-3.5 text-white" />
        <span className="text-[11px] font-semibold text-white tracking-widest uppercase">
          Secure Foundation Fund
        </span>
      </div>
    </div>
  );
};
