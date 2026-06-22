import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactDetailsCardProps {
  email: string;
  mobile: string;
  address: string;
}

const ContactRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-full bg-[#E8F4F4] flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-[#6A7171] uppercase tracking-wide">
        {label}
      </span>
      <span className="text-[14px] text-[#1A1A1A] leading-snug">{value}</span>
    </div>
  </div>
);

export const ContactDetailsCard: React.FC<ContactDetailsCardProps> = ({
  email,
  mobile,
  address,
}) => (
  <div className="flex flex-col gap-2">
    {/* Section label */}
    <span className="text-[11px] font-bold text-[#6A7171] uppercase tracking-widest px-1">
      Contact Details
    </span>

    <div className="bg-white rounded-[16px] px-4 py-4 flex flex-col gap-4">
      <ContactRow
        icon={<Mail className="w-4 h-4 text-[#0A5F5F]" />}
        label="Email Address"
        value={email}
      />
      <div className="h-px bg-gray-100" />
      <ContactRow
        icon={<Phone className="w-4 h-4 text-[#0A5F5F]" />}
        label="Mobile Number"
        value={mobile}
      />
      <div className="h-px bg-gray-100" />
      <ContactRow
        icon={<MapPin className="w-4 h-4 text-[#0A5F5F]" />}
        label="Residential Address"
        value={address}
      />
    </div>
  </div>
);
