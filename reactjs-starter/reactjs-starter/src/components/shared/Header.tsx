import React from "react";
import nesamLogo from "../../assets/NESAm-logo.svg";
import irttaaLogo from "../../assets/IRTTAA-logo.svg";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <img
            src={nesamLogo}
            alt="NESAm"
            className="h-10 md:h-12 w-auto object-contain"
          />
          <img
            src={irttaaLogo}
            alt="IRTTAA"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
}