import React from 'react';
import { DashboardModel } from '../../domain/models/dashboard.model';
import { ClipboardList } from 'lucide-react';

interface DfcCardProps {
  data: DashboardModel;
}

export const DfcCard: React.FC<DfcCardProps> = ({ data }) => {
  if (!data.hasPendingDfc) return null;

  return (
    <div className="border border-gray-800 rounded-2xl p-4 flex justify-between items-center bg-white shadow-sm">
      <div className="flex gap-4 items-center">
        <ClipboardList className="w-6 h-6 text-[#8B2323]" />
        <div className="flex flex-col">
          <span className="text-[#8B2323] text-sm font-semibold tracking-tight">Pending DFC Dues</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[#8B2323] text-xl font-bold">₹500</span>
            <span className="text-[#8B2323] text-xs">outstanding</span>
          </div>
        </div>
      </div>
      <div>
        <button onClick={() => alert('Coming Soon')} className="bg-[#0D6A66] hover:bg-[#0A5450] text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200 shadow-[0_4px_14px_rgba(13,106,102,0.39)]">
          Pay
        </button>
      </div>
    </div>
  );
};
