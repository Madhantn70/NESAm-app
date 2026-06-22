import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { DfcHistory } from '../../domain/models/notification.model';

interface DfcHistoryCardProps {
  item: DfcHistory;
}

export const DfcHistoryCard: React.FC<DfcHistoryCardProps> = ({ item }) => (
  <div className="bg-white rounded-[16px] px-4 py-3.5 flex items-center gap-3 shadow-sm">
    {/* Check icon */}
    <div className="w-10 h-10 rounded-full bg-[#E0F0F0] flex items-center justify-center shrink-0">
      <CheckCircle2 className="w-5 h-5 text-[#0A5F5F]" />
    </div>

    {/* Name + batch + paid date */}
    <div className="flex flex-col flex-1 gap-0.5">
      <span className="text-[14px] font-bold text-[#1A1A1A] leading-tight">{item.name}</span>
      <span className="text-[13px] font-semibold text-[#1A1A1A]">{item.batch}</span>
      <span className="text-[12px] text-gray-400">Paid on {item.paidDate}</span>
    </div>

    {/* Amount */}
    <span className="text-[15px] font-bold text-[#0A5F5F]">₹{item.amount.toLocaleString()}</span>
  </div>
);
