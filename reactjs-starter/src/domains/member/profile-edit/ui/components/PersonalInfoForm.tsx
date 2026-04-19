import React from 'react';
import { Lock } from 'lucide-react';

interface PersonalInfoFormProps {
  name: string;
  dob: string;
  graduationYear: string;
}

interface LockedFieldProps {
  label: string;
  value: string;
}

const LockedField: React.FC<LockedFieldProps> = ({ label, value }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-[#6A7171] uppercase tracking-widest">
      {label}
    </label>
    <div className="flex items-center bg-[#F2F2F2] rounded-[12px] px-4 py-3">
      <input
        type="text"
        value={value}
        disabled
        readOnly
        className="flex-1 bg-transparent text-[14px] text-[#9A9A9A] outline-none cursor-not-allowed select-none"
      />
      <Lock className="w-4 h-4 text-[#B0B0B0] shrink-0" />
    </div>
  </div>
);

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  name,
  dob,
  graduationYear,
}) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-[20px] font-bold text-[#1A1A1A]">Personal Information</h2>
    <LockedField label="Full Name" value={name} />
    <LockedField label="Date of Birth" value={dob} />
    <LockedField label="Graduation Year" value={graduationYear} />
  </div>
);
