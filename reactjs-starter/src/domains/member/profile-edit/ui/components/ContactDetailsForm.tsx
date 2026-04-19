import React from 'react';
import { Mail, Smartphone, MapPin } from 'lucide-react';

interface ContactDetailsFormProps {
  email: string;
  mobile: string;
  address: string;
}

interface ContactFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  multiline?: boolean;
}

const ContactField: React.FC<ContactFieldProps> = ({ label, value, icon, multiline }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-[#6A7171] uppercase tracking-widest">
      {label}
    </label>
    <div className="flex items-start bg-[#F2F2F2] rounded-[12px] px-4 py-3 gap-3">
      <span className="text-[#0A5F5F] mt-0.5 shrink-0">{icon}</span>
      {multiline ? (
        <textarea
          defaultValue={value}
          rows={2}
          className="flex-1 bg-transparent text-[14px] text-[#9A9A9A] outline-none resize-none placeholder-gray-400 leading-snug"
        />
      ) : (
        <input
          type="text"
          defaultValue={value}
          className="flex-1 bg-transparent text-[14px] text-[#9A9A9A] outline-none placeholder-gray-400"
        />
      )}
    </div>
  </div>
);

export const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  email,
  mobile,
  address,
}) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-[20px] font-bold text-[#1A1A1A]">Contact Details</h2>
    <ContactField
      label="Email Address"
      value={email}
      icon={<Mail className="w-4 h-4" />}
    />
    <ContactField
      label="Mobile Number"
      value={mobile}
      icon={<Smartphone className="w-4 h-4" />}
    />
    <ContactField
      label="Residential Address"
      value={address}
      icon={<MapPin className="w-4 h-4" />}
      multiline
    />
  </div>
);
