import React from 'react';

interface HeaderProps {
  showTitle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showTitle = false }) => {
  return (
    <div className="flex justify-between items-center w-full px-4 py-3 bg-transparent">
      {/* Left: NESAm Logo + optional title */}
      <div className="flex items-center gap-1">
        <div className="w-[56px] h-[56px] flex items-center justify-center">
          <img
            src="/NESAm-logo.png"
            alt="NESAm Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="%230A5F5F" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
            }}
          />
        </div>
        {showTitle && (
          <span className="text-[22px] font-extrabold text-[#1A1A1A] tracking-tight">
            NESAm
          </span>
        )}
      </div>

      {/* Right: IRTTAA Logo */}
      <div className="w-[56px] h-[56px] flex items-center justify-center">
        <img
          src="/IRTTAA-logo.png"
          alt="IRTT Alumni Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="%230A5F5F" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
          }}
        />
      </div>
    </div>
  );
};
